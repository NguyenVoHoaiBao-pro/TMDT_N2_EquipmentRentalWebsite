package com.example.demo.service.order;

import com.example.demo.dto.order.request.CheckoutRequest;
import com.example.demo.dto.order.response.CheckoutResponse;
import com.example.demo.entity.CartItem;
import com.example.demo.entity.Order;
import com.example.demo.entity.OrderDetail;
import com.example.demo.entity.User;
import com.example.demo.enumValues.CartItemStatus;
import com.example.demo.enumValues.OrderStatus;
import com.example.demo.repository.payment.PaymentRepository;
import com.example.demo.repository.user.CartItemRepository;
import com.example.demo.repository.order.OrderDetailRepository;
import com.example.demo.repository.order.OrderRepository;
import com.example.demo.repository.user.UserRepository;
import com.example.demo.service.payment.PaymentService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderDetailRepository orderDetailRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;

    private final Map<String, PaymentService> paymentStrategies;
    private final PaymentRepository paymentRepository;

    @Transactional
    public CheckoutResponse createPendingOrder(CheckoutRequest request, Long renterId, HttpServletRequest httpServletRequest) {
        // 1. Tìm thông tin người thuê máy
        User renter = userRepository.findById(renterId)
            .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy tài khoản người thuê!"));

        // 2. Lấy danh sách các món đồ được chọn từ Giỏ hàng trong DB lên
        List<CartItem> selectedCartItems = new ArrayList<>();
        for (Long cartItemId : request.cartItemIds()) {
            CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new EntityNotFoundException("Món đồ có ID " + cartItemId + " không tồn tại trong giỏ!"));

            // Bảo mật: Đảm bảo món đồ này thuộc về chính người đang thao tác
            if (!item.getUser().getId().equals(renterId)) {
                throw new org.springframework.security.access.AccessDeniedException("Bạn không có quyền thanh toán món đồ này!");
            }
            // Đảm bảo món đồ vẫn đang ở trạng thái ACTIVE trong giỏ
            if (item.getStatus() != CartItemStatus.ACTIVE) {
                throw new IllegalStateException("Món đồ này đã được thanh toán hoặc hết hạn trước đó!");
            }
            selectedCartItems.add(item);
        }

        // 3. TÍNH TOÁN KHOẢNG NGÀY THUÊ TỔNG VÀ TỔNG TIỀN (Gồm Tiền thuê + Tiền cọc)
        LocalDate minStartDate = selectedCartItems.stream().map(CartItem::getStartDate).min(LocalDate::compareTo).orElse(LocalDate.now());
        LocalDate maxEndDate = selectedCartItems.stream().map(CartItem::getEndDate).max(LocalDate::compareTo).orElse(LocalDate.now());

        BigDecimal totalRentalFee = BigDecimal.ZERO;
        BigDecimal totalDeposit = BigDecimal.ZERO;

        for (CartItem item : selectedCartItems) {
            BigDecimal itemRentalFee = item.getDevice().getPricePerDay().multiply(BigDecimal.valueOf(item.getRentalDays()));
            totalRentalFee = totalRentalFee.add(itemRentalFee);
            totalDeposit = totalDeposit.add(item.getDevice().getDepositValue());
        }

        // Tổng số tiền cần thanh toán qua cổng điện tử = Tiền thuê máy + Tiền đặt cọc
        BigDecimal totalPriceAll = totalRentalFee.add(totalDeposit);

        // 4. LƯU ĐƠN HÀNG TỔNG (Trạng thái ban đầu bắt buộc là PENDING)
        Order order = Order.builder()
            .renter(renter)
            .startDate(minStartDate)
            .endDate(maxEndDate)
            .totalPrice(totalPriceAll)
            .status(OrderStatus.PENDING_PAYMENT)
            .build();

        order = orderRepository.save(order);

        // 5. CHỐT GIÁ VÀ LƯU VÀO BẢNG CHI TIẾT ĐƠN HÀNG (Order Details)
        for (CartItem item : selectedCartItems) {
            OrderDetail detail = OrderDetail.builder()
                .order(order)
                .device(item.getDevice())
                .pricePerDay(item.getDevice().getPricePerDay()) // Chốt giá cố định đề phòng chủ máy đổi giá sau này
                .depositAmount(item.getDevice().getDepositValue())
                .build();

            orderDetailRepository.save(detail);

            //  Đổi trạng thái trong giỏ hàng sang CHECKED_OUT để ẩn khỏi giỏ của người dùng
            item.setStatus(CartItemStatus.CHECKED_OUT);
            cartItemRepository.save(item);
        }

        // ===== BƯỚC 6: TÍCH HỢP STRATEGY PATTERN VÀO ĐÂY =====
        String paymentToken = java.util.UUID.randomUUID().toString();

        // Tìm Service dựa theo chuỗi phương thức khách gửi lên (VNPAY -> VNPAYPaymentService)
        String strategyKey = request.paymentMethod().toUpperCase() + "PaymentService";
        PaymentService strategy = paymentStrategies.get(strategyKey);

        if (strategy == null) {
            throw new IllegalArgumentException("Phương thức thanh toán " + request.paymentMethod() + " không được hỗ trợ!");
        }

        com.example.demo.entity.Payment paymentRecord = com.example.demo.entity.Payment.builder()
            .order(order)
            .amount(totalPriceAll)
            .paymentMethod(com.example.demo.enumValues.PaymentMethod.valueOf(request.paymentMethod().toUpperCase()))
            .status(com.example.demo.enumValues.PaymentStatus.PENDING)
            .paymentToken(paymentToken)
            .build();
        paymentRepository.save(paymentRecord);

        String realPaymentUrl = strategy.createPaymentUrl(order, totalPriceAll, paymentToken, httpServletRequest);

        return new CheckoutResponse(order.getId(), totalPriceAll, realPaymentUrl, paymentToken);
    }
}
