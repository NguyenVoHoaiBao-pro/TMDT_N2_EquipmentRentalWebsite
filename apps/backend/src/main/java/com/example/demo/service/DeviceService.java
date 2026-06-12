package com.example.demo.service;

import com.example.demo.dto.product.request.DeviceRequest;
import com.example.demo.entity.Product;
import com.example.demo.entity.Device;
import com.example.demo.entity.User;
import com.example.demo.enumValues.DeviceStatus; // ENUM: PENDING_APPROVAL, APPROVED...
import com.example.demo.repository.IDeviceRepository;
import com.example.demo.repository.IProductRepository;
import com.example.demo.repository.IUserRepository; // Giả định bạn có repo này
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DeviceService {

    private final IDeviceRepository deviceRepository;
    private final IProductRepository productRepository;
    private final IUserRepository userRepository;

    private final DeviceImageService deviceImageService;
    private final ProductService productService;

    // Owner posts a new device item
    @Transactional
    public void createProductItem(DeviceRequest request, Long authenticatedUserId) {
        // 1. Check if the product exists
        Product product = productRepository.findById(request.getProductId())
            .orElseThrow(() -> new EntityNotFoundException("Not found product with id: " + request.getProductId()));

        // 2. Retrieve the authenticated user that logged in
        User owner = userRepository.findById(authenticatedUserId)
            .orElseThrow(() -> new EntityNotFoundException("Not found user with id: " + authenticatedUserId));

        // 3. Build and save the new device item
        Device newItem = Device.builder()
            .product(product)
            .owner(owner)
            .serialNumber(request.getSerialNumber())
            .conditionPercent(request.getConditionPercent())
            .pricePerDay(request.getPricePerDay())
            .depositValue(request.getDepositValue())
            .status(DeviceStatus.PENDING_APPROVAL) // Needed for admin approval
            .build();

        Device savedItem = deviceRepository.save(newItem);

        // 4. Save the primary image and sub images
        deviceImageService.saveItemImages(savedItem, request.getPrimaryImageUrl(), request.getSubImages());
    }

    // Admin approve a device item
    @Transactional
    public void approveProductItem(Long itemId) {
        // 1. Chỉ cập nhật đúng chiếc máy cần duyệt thông qua ID
        Device item = deviceRepository.findById(itemId)
            .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy bài đăng thiết bị"));

        item.setStatus(DeviceStatus.APPROVED);
        deviceRepository.save(item); // Hoặc để Dirty Checking tự lo

        // 2. Tách biệt hoàn toàn luồng: Gọi sang ProductService để tính lại giá sàn
        // Bản thân hàm updateBasePrice sẽ tự SELECT mới hoàn toàn từ DB nên dữ liệu luôn chính xác
        productService.updateBasePrice(item.getProduct().getId());
    }
}
