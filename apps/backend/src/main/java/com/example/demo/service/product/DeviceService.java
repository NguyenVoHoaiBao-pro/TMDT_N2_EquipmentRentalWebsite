package com.example.demo.service.product;

import com.example.demo.dto.product.core.response.ProductInformation;
import com.example.demo.dto.product.core.response.ProductResponse;
import com.example.demo.dto.product.core.response.SpecificationDTO;
import com.example.demo.dto.product.device.response.*;
import com.example.demo.dto.product.owner.OwnerDTO;
import com.example.demo.dto.product.device.request.DeviceImageRequest;
import com.example.demo.dto.product.device.request.DeviceRequest;
import com.example.demo.dto.product.review.ReviewDTO;
import com.example.demo.entity.*;
import com.example.demo.enumValues.DeviceStatus;
import com.example.demo.repository.product.DeviceCalendarRepository;
import com.example.demo.repository.product.DeviceImageRepository;
import com.example.demo.repository.product.DeviceRepository;
import com.example.demo.repository.product.ProductRepository;
import com.example.demo.repository.review.ProductReviewRepository;
import com.example.demo.repository.user.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DeviceService {
    private final DeviceRepository deviceRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final DeviceImageService deviceImageService;
    private final ProductService productService;
    private final DeviceImageRepository deviceImageRepository;
    private final ProductReviewRepository productReviewRepository;
    private final DeviceCalendarRepository deviceCalendarRepository;

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

    @Transactional(readOnly = true)
    public DeviceDetailResponse getDeviceDetail(Long productId) {
        Device device = deviceRepository.findFirstByProductIdAndStatus(productId, DeviceStatus.APPROVED)
            .orElseThrow(() -> new EntityNotFoundException("Dòng sản phẩm này hiện tại không có máy nào sẵn sàng cho thuê!"));


        Product product = device.getProduct();
        User owner = device.getOwner();

        List<SpecificationDTO> specificationDTOs = new ArrayList<>();
        if (product.getSpecifications() != null) {
            product.getSpecifications().forEach((key, value) ->
                specificationDTOs.add(new SpecificationDTO(key, String.valueOf(value)))
            );
        }

        List<String> includedItemsList = new ArrayList<>();
        if (product.getAccessoriesIncluded() != null && !product.getAccessoriesIncluded().isBlank()) {
            includedItemsList = Arrays.stream(product.getAccessoriesIncluded().split("\\R")) // "\\R regex pattern matches any newline character"
                .map(String::trim)
                .filter(item -> !item.isEmpty())
                .toList();
        }
        ProductInformation productInfo =
            new ProductInformation(
                product.getId(),
                product.getName(),
                product.getSlug(),
                product.getCategory() != null ? product.getCategory().getName() : null,
                product.getBrand() != null ? product.getBrand().getName() : null,
                product.getDescription(),
                specificationDTOs,
                includedItemsList
            );

        String calculatedAvailability = "AVAILABLE";
        var todayCalendar = deviceCalendarRepository.findByDeviceIdAndEventDate(device.getId(), LocalDate.now());
        if (todayCalendar.isPresent()) {
            calculatedAvailability = switch (todayCalendar.get().getStatus()) {
                case BOOKED -> "RENTED";
                case OWNER_BLOCK -> "RESERVED";
                case MAINTENANCE -> "MAINTENANCE";
            };
        }

        List<DeviceImage> deviceImages = deviceImageRepository.findByDeviceId(device.getId());
        List<DeviceImageDTO> imageDTOs = deviceImages.stream()
            .map(img -> new DeviceImageDTO(img.getId(), img.getImageUrl(), img.isPrimary()))
            .toList();

        List<LocalDate> futureBlockedDates = deviceCalendarRepository.findFutureBlockedDatesByDeviceId(device.getId());

        List<String> bookDatesStr = futureBlockedDates.stream()
            .map(LocalDate::toString)
            .toList();

        DeviceInformation deviceInfo =
            new DeviceInformation(
                device.getId(),
                owner.getId(),
                device.getConditionPercent(),
                calculatedAvailability,
                device.getPricePerDay(),
                device.getDepositValue(),
                BigDecimal.ZERO,
                imageDTOs,
                bookDatesStr
            );

        OwnerDTO ownerInfo =
            new OwnerDTO(
                owner.getId(),
                owner.getFullName(),
                owner.getAvatarUrl(),
                true
            );

        List<ProductReview> latestReviews = productReviewRepository.findLatestReviewsByDeviceId(device.getId(), PageRequest.of(0, 3));

        List<ReviewDTO> reviewDTOs = latestReviews.stream()
            .map(rev -> new ReviewDTO(
                rev.getId(),
                rev.getRenter() != null ? rev.getRenter().getUsername() : "Ẩn danh",
                rev.getRating(),
                rev.getComment(),
                rev.getCreatedAt()
            ))
            .toList();

        List<ProductResponse> relatedProducts = productService.getTop4RelatedProducts(
            product.getCategory() != null ? product.getCategory().getName() : null,
            product.getId()
        );

        return new DeviceDetailResponse(
            productInfo,
            deviceInfo,
            ownerInfo,
            reviewDTOs,
            relatedProducts
        );
    }


    // For Owner Dashboard
    @Transactional(readOnly = true)
    public List<DeviceManageResponse> getDevicesByOwner(Long ownerId) {
        // 1. Find all devices owned by the owner
        List<Device> myDevices = deviceRepository.findByOwnerId(ownerId);

        // 2. Iterate through each device and map to DeviceManageResponse
        return myDevices.stream().map(device -> {
            // Collect all images for this device
            List<DeviceImageRequest> allImages = device.getDeviceImages().stream()
                .map(img -> new DeviceImageRequest(img.getImageUrl(), img.getImageType().name()))
                .toList();

            return new DeviceManageResponse(
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
