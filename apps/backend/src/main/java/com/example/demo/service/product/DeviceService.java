package com.example.demo.service.product;

import com.example.demo.dto.product.request.DeviceRequest;
import com.example.demo.entity.Product;
import com.example.demo.entity.Device;
import com.example.demo.entity.User;
import com.example.demo.enumValues.DeviceStatus;
import com.example.demo.repository.product.DeviceRepository;
import com.example.demo.repository.product.ProductRepository;
import com.example.demo.repository.user.UserRepository; // Giả định hệ thống có repo này
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DeviceService {
    private final DeviceRepository deviceRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final DeviceImageService deviceImageService;
    private final ProductService productService;

    @Transactional
    public void createProductItem(DeviceRequest request, Long authenticatedUserId) {
        Product product = productRepository.findById(request.getProductId())
            .orElseThrow(() -> new EntityNotFoundException("Not found product with id: " + request.getProductId()));

        User owner = userRepository.findById(authenticatedUserId)
            .orElseThrow(() -> new EntityNotFoundException("Not found user with id: " + authenticatedUserId));

        Device newItem = Device.builder()
            .product(product)
            .owner(owner)
            .serialNumber(request.getSerialNumber())
            .conditionPercent(request.getConditionPercent())
            .pricePerDay(request.getPricePerDay())
            .depositValue(request.getDepositValue())
            .status(DeviceStatus.PENDING_APPROVAL)
            .build();

        Device savedItem = deviceRepository.save(newItem);
        deviceImageService.saveItemImages(savedItem, request.getPrimaryImageUrl(), request.getSubImages());
    }

    @Transactional
    public void approveProductItem(Long itemId) {
        Device item = deviceRepository.findById(itemId)
            .orElseThrow(() -> new EntityNotFoundException("Not found device with id: " + itemId));

        item.setStatus(DeviceStatus.APPROVED);
        deviceRepository.save(item);

        productService.updateBasePrice(item.getProduct().getId());
    }
}
