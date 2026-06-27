package com.example.demo.service.product;

import com.example.demo.dto.product.request.DeviceImageRequest;
import com.example.demo.dto.product.request.DeviceRequest;
//import com.example.demo.dto.product.response.DeviceDetailResponse;
import com.example.demo.dto.product.response.DeviceManageResponse;
import com.example.demo.entity.*;
import com.example.demo.enumValues.DeviceStatus;
import com.example.demo.repository.product.DeviceRepository;
import com.example.demo.repository.product.ProductRepository;
import com.example.demo.repository.user.UserRepository; // Giả định hệ thống có repo này
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

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

//    @Transactional(readOnly = true)
//    public DeviceDetailResponse getDeviceDetail(Long deviceId) {
//        // 1. Find device by ID in the database
//        Device device = deviceRepository.findById(deviceId)
//            .orElseThrow(() -> new EntityNotFoundException("Not found device with id: " + deviceId));
//
//        Product product = device.getProduct();
//        User owner = device.getOwner();
//
//        // 2. Get all subImages of that device
//        List<String> subImageUrls = device.getDeviceImages().stream()
//            .filter(img -> !img.isPrimary()) // Exclude primary image
//            .map(DeviceImage::getImageUrl)
//            .toList();
//
//        List<LocalDate> bookDates = device.getDeviceCalendar().stream()
//            .map(DeviceCalendar::getEventDate)
//            .toList();
//
//        return new DeviceDetailResponse(
//            device.getId(),
//            product.getName(),
//            owner.getFullName(),
//            owner.getTrustScore() != null ? owner.getTrustScore() : BigDecimal.ZERO,
//            device.getConditionPercent(),
//            device.getPricePerDay(),
//            device.getDepositValue(),
//            product.getImages().stream()
//                .filter(ProductImage::isPrimary)
//                .map(ProductImage::getImageUrl)
//                .findFirst()
//                .orElse(null),
//            subImageUrls,
//            bookDates
//        );
//    }

    // For Owner Dashboard
    @Transactional(readOnly = true)
    public List<DeviceManageResponse> getDevicesByOwner(Long ownerId) {
        // 1. Find all devices owned by the owner
        List<Device> myDevices = deviceRepository.findByOwnerId(ownerId);

        // 2. Iterate through each device and map to DeviceManageResponse
        return myDevices.stream().map(device -> {
            // Collect all images for this device
            List<DeviceImageRequest> allImages = device.getDeviceImages().stream()
                .map(img -> new com.example.demo.dto.product.request.DeviceImageRequest(img.getImageUrl(), img.getImageType().name()))
                .toList();

            return new com.example.demo.dto.product.response.DeviceManageResponse(
                device.getId(),
                device.getProduct().getId(),
                device.getProduct().getName(),
                device.getSerialNumber(),
                device.getConditionPercent(),
                device.getPricePerDay(),
                device.getDepositValue(),
                device.getStatus().name(), // PENDING_APPROVAL, APPROVED, REJECTED
                allImages
            );
        }).toList();
    }

}
