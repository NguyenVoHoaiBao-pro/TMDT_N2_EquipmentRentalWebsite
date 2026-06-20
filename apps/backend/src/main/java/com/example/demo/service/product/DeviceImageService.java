package com.example.demo.service.product;

import com.example.demo.dto.product.request.DeviceImageRequest;
import com.example.demo.entity.Device;
import com.example.demo.entity.DeviceImage;
import com.example.demo.enumValues.ImageType;
import com.example.demo.repository.product.DeviceImageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DeviceImageService {
    private final DeviceImageRepository itemImageRepository;

    @Transactional
    public void saveItemImages(Device device, String primaryImageUrl, List<DeviceImageRequest> subImages) {
        // Store primary image
        DeviceImage primaryImg = DeviceImage.builder()
            .device(device)
            .imageUrl(primaryImageUrl)
            .imageType(ImageType.REAL_SHOT)
            .isPrimary(true)
            .build();
        itemImageRepository.save(primaryImg);

        // Iterate through sub-images and save them
        if (subImages != null && !subImages.isEmpty()) {
            for (DeviceImageRequest imgReq : subImages) {
                DeviceImage subImg = DeviceImage.builder()
                    .device(device)
                    .imageUrl(imgReq.imageUrl())
                    .imageType(ImageType.valueOf(imgReq.imageType()))
                    .isPrimary(false)
                    .build();
                itemImageRepository.save(subImg);
            }
        }
    }
}
