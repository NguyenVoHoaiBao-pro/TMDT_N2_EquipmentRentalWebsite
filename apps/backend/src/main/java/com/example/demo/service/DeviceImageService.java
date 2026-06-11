package com.example.demo.service;

import com.example.demo.dto.product.request.DeviceImageRequest;
import com.example.demo.entity.Device;
import com.example.demo.entity.DeviceImage;
import com.example.demo.enumValues.ImageType; // ENUM: REAL_SHOT, SERIAL_PROOF
import com.example.demo.repository.IDeviceImageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DeviceImageService {

    private final IDeviceImageRepository itemImageRepository;

    @Transactional
    public void saveItemImages(Device device, String primaryImageUrl, List<DeviceImageRequest> subImages) {
        // 1. Lưu ảnh chính (Bắt buộc là REAL_SHOT và isPrimary = true)
        DeviceImage primaryImg = DeviceImage.builder()
            .device(device)
            .imageUrl(primaryImageUrl)
            .imageType(ImageType.REAL_SHOT)
            .isPrimary(true)
            .build();
        itemImageRepository.save(primaryImg);

        // 2. Duyệt qua danh sách ảnh phụ từ Request và lưu vào DB
        if (subImages != null && !subImages.isEmpty()) {
            List<DeviceImage> itemImages = subImages.stream().map(imgReq ->
                DeviceImage.builder()
                    .device(device)
                    .imageUrl(imgReq.imageUrl())
                    .imageType(ImageType.valueOf(imgReq.imageType())) // Convert String sang Enum
                    .isPrimary(false)
                    .build()
            ).toList();

            itemImageRepository.saveAll(itemImages);
        }
    }
}
