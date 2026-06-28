package com.example.demo.service.order;

import com.example.demo.entity.Device;
import com.example.demo.entity.Order;
import com.example.demo.entity.OrderDetail;
import com.example.demo.entity.User;
import com.example.demo.enumValues.OrderStatus;
import com.example.demo.repository.order.OrderRepository;
import com.example.demo.repository.product.DeviceRepository;
import com.example.demo.repository.user.UserRepository;
import com.example.demo.service.product.DeviceCalendarService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final DeviceRepository deviceRepository;
    private final DeviceCalendarService calendarService;

    @Transactional
    public Order createOrder(Long renterId, List<Long> deviceIds, LocalDate startDate, LocalDate endDate) {
        User renter = userRepository.findById(renterId)
            .orElseThrow(() -> new EntityNotFoundException("Renter not found"));

        long days = ChronoUnit.DAYS.between(startDate, endDate) + 1;
        if (days <= 0) {
            throw new IllegalArgumentException("End date must be greater than or equal to start date");
        }

        // Khởi tạo bản ghi Order tổng quan
        Order order = Order.builder()
            .renter(renter)
            .startDate(startDate)
            .endDate(endDate)
            .status(OrderStatus.PENDING)
            .totalPrice(BigDecimal.ZERO)
            .orderDetails(new ArrayList<>())
            .build();

        BigDecimal totalPriceCalculated = BigDecimal.ZERO;

        for (Long deviceId : deviceIds) {
            Device device = deviceRepository.findById(deviceId)
                .orElseThrow(() -> new EntityNotFoundException("Device not found: " + deviceId));

            // 1. Tạo chi tiết hóa đơn, đóng băng giá tại thời điểm đặt đơn
            OrderDetail detail = OrderDetail.builder()
                .order(order)
                .device(device)
                .pricePerDay(device.getPricePerDay())
                .depositAmount(device.getDepositValue())
                .build();

            order.getOrderDetails().add(detail);

            // 2. Tính toán tổng tiền: (Giá thuê/ngày * số ngày) + tiền cọc máy đó
            BigDecimal itemTotalCost = device.getPricePerDay().multiply(BigDecimal.valueOf(days))
                .add(device.getDepositValue());

            totalPriceCalculated = totalPriceCalculated.add(itemTotalCost);

            // 3. Gọi DeviceCalendarService đã có của bạn để chặn lịch ngày này luôn
            calendarService.lockCalendarForOrder(device, startDate, endDate, order);
        }

        order.setTotalPrice(totalPriceCalculated);
        return orderRepository.save(order);
    }
}
