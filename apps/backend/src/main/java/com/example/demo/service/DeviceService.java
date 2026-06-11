package com.example.demo.service;

import com.example.demo.dto.product.request.ProductItemRequest;
import com.example.demo.entity.Product;
import com.example.demo.entity.ProductItem;
import com.example.demo.entity.User;
import com.example.demo.enumValues.ProductItemStatus; // ENUM: PENDING_APPROVAL, APPROVED...
import com.example.demo.repository.IProductItemRepository;
import com.example.demo.repository.IProductRepository;
import com.example.demo.repository.IUserRepository; // Giả định bạn có repo này
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProductItemService {

    private final IProductItemRepository productItemRepository;
    private final IProductRepository productRepository;
    private final IUserRepository userRepository;

    private final ProductItemImageService itemImageService;
    private final ProductService productService; // Để cập nhật giá thấp nhất của dòng máy cha

    // LUỒNG 1: CHỦ MÁY ĐĂNG BÀI
    @Transactional
    public void createProductItem(ProductItemRequest request, Long authenticatedUserId) {
        // 1. Kiểm tra dòng máy cha có tồn tại không
        Product product = productRepository.findById(request.getProductId())
            .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy dòng máy hệ thống"));

        // 2. Lấy thông tin user đang đăng nhập (Bảo mật: Lấy từ Token chứ không lấy từ Request body)
        User owner = userRepository.findById(authenticatedUserId)
            .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy thông tin tài khoản"));

        // 3. Tạo thực thể ProductItem với trạng thái chờ duyệt
        ProductItem newItem = ProductItem.builder()
            .product(product)
            .owner(owner)
            .serialNumber(request.getSerialNumber())
            .conditionPercent(request.getConditionPercent())
            .pricePerDay(request.getPricePerDay())
            .depositValue(request.getDepositValue())
            .status(ProductItemStatus.PENDING_APPROVAL) // Mặc định chờ Admin duyệt
            .build();

        ProductItem savedItem = productItemRepository.save(newItem);

        // 4. Gọi ImageService bổ trợ để bóc tách và lưu ảnh thực tế đính kèm
        itemImageService.saveItemImages(savedItem, request.getPrimaryImageUrl(), request.getSubImages());
    }

    // LUỒNG 2: ADMIN DUYỆT BÀI ĐĂNG
    @Transactional
    public void approveProductItem(Long itemId) {
        ProductItem item = productItemRepository.findById(itemId)
            .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy bài đăng thiết bị"));

        // 1. Chuyển trạng thái sang APPROVED
        item.setStatus(ProductItemStatus.APPROVED);
        productItemRepository.save(item);

        // 2. TRIGGER: Gọi ProductService cập nhật lại giá sàn thấp nhất (base_price) cho dòng máy chung
        // Việc này giúp trang chủ hiển thị đúng mức giá thuê "chỉ từ X.000đ/ngày" của dòng máy đó
        productService.updateBasePrice(item.getProduct().getId());
    }
}
