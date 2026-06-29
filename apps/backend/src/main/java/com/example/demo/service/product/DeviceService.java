package com.example.demo.service.product;

import com.example.demo.dto.product.core.response.ProductInformation;
import com.example.demo.dto.product.core.response.SpecificationDTO;
import com.example.demo.dto.product.device.response.DeviceDetailResponse;
import com.example.demo.dto.product.device.response.DeviceImageDTO;
import com.example.demo.dto.product.device.response.DeviceInformation;
import com.example.demo.dto.product.owner.OwnerDTO;
import com.example.demo.dto.product.device.request.DeviceImageRequest;
import com.example.demo.dto.product.device.request.DeviceRequest;
import com.example.demo.dto.product.device.response.DeviceManageResponse;
import com.example.demo.dto.product.review.ReviewDTO;
import com.example.demo.entity.*;
import com.example.demo.enumValues.DeviceStatus;
import com.example.demo.repository.product.DeviceCalendarRepository;
import com.example.demo.repository.product.DeviceImageRepository;
import com.example.demo.repository.product.DeviceRepository;
import com.example.demo.repository.product.ProductRepository;
import com.example.demo.repository.review.ReviewRepository;
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
    private final ReviewRepository reviewRepository;
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
        // 1. Lấy thông tin chính của Device, Product, Category, Brand, Owner bằng 1 câu lệnh JOIN FETCH
        Device device = deviceRepository.findFirstByProductIdAndStatus(productId, DeviceStatus.APPROVED)
            .orElseThrow(() -> new EntityNotFoundException("Dòng sản phẩm này hiện tại không có máy nào sẵn sàng cho thuê!"));


        Product product = device.getProduct();
        User owner = device.getOwner();

        // 2. Map cụm 1: ProductInformation (Thông tin dòng sản phẩm crawl)
        // Trường specifications trong Entity Product của bạn đã là Map<String, Object> (trang 9) nhờ Hibernate Json
        List<SpecificationDTO> specificationDTOs = new ArrayList<>();
        if (product.getSpecifications() != null) {
            product.getSpecifications().forEach((key, value) ->
                specificationDTOs.add(new SpecificationDTO(key, String.valueOf(value)))
            );
        }

        // Trường accessoriesIncluded dạng chuỗi TEXT, ta split theo dấu phẩy để ra mảng List<String> cho FE
        List<String> includedItemsList = new ArrayList<>();
        if (product.getAccessoriesIncluded() != null && !product.getAccessoriesIncluded().isBlank()) {
            includedItemsList = Arrays.stream(product.getAccessoriesIncluded().split(","))
                .map(String::trim)
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

        // 3. Tính toán trạng thái vận hành động (availability) dựa trên bảng lịch ngày hôm nay
        String calculatedAvailability = "AVAILABLE"; // Mặc định là sẵn sàng cho thuê
        var todayCalendar = deviceCalendarRepository.findByDeviceIdAndEventDate(device.getId(), LocalDate.now());
        if (todayCalendar.isPresent()) {
            // Áp dụng map trạng thái từ bảng lịch sang chuẩn FE yêu cầu
            calculatedAvailability = switch (todayCalendar.get().getStatus()) {
                case BOOKED -> "RENTED";
                case OWNER_BLOCK -> "RESERVED";
                case MAINTENANCE -> "MAINTENANCE";
            };
        }

        // 4. Lấy danh sách ảnh thực tế của thiết bị và map sang DeviceImageDTO
        List<DeviceImage> deviceImages = deviceImageRepository.findByDeviceId(device.getId());
        List<DeviceImageDTO> imageDTOs = deviceImages.stream()
            .map(img -> new DeviceImageDTO(img.getId(), img.getImageUrl(), img.isPrimary()))
            .toList();

        // 5. Map cụm 2: DeviceInformation (Thông tin cá thể máy)
        DeviceInformation deviceInfo =
            new DeviceInformation(
                device.getId(),
                owner.getId(),
                device.getConditionPercent(),
                calculatedAvailability,
                device.getPricePerDay(),
                device.getDepositValue(),
                BigDecimal.ZERO, // Trường insurance chưa có trong DB, tạm thời hardcode 0 để FE không bị lỗi
                imageDTOs
            );

        // 6. Map cụm 3: OwnerDTO (Thông tin chủ sở hữu máy)
        OwnerDTO ownerInfo =
            new OwnerDTO(
                owner.getId(),
                owner.getFullName(),
                owner.getAvatarUrl(),
                true // Tạm thời hardcode đã xác minh profile sơ bộ, bạn có thể kiểm tra kycVerifications sau
            );

        // 7. Lấy danh sách 3 bài đánh giá mới nhất (Preview) và map cụm 4: ReviewDTO
        List<Review> latestReviews = reviewRepository.findLatestReviewsByDeviceId(device.getId(), PageRequest.of(0, 3));
        List<ReviewDTO> reviewDTOs = latestReviews.stream()
            .map(rev -> new ReviewDTO(
                rev.getId(),
                rev.getAuthor() != null ? rev.getAuthor().getUsername() : "Ẩn danh",
                rev.getRating(),
                rev.getComment(),
                rev.getCreatedAt()
            ))
            .toList();

        // 8. Đóng gói tất cả các cụm dữ liệu lồng nhau vào Object Response tổng ngoài cùng và trả về
        return new DeviceDetailResponse(
            productInfo,
            deviceInfo,
            ownerInfo,
            reviewDTOs
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
