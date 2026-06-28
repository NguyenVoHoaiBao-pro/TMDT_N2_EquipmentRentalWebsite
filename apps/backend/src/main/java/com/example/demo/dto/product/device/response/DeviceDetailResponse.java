package com.example.demo.dto.product.device.response;

import com.example.demo.dto.product.core.response.ProductInformation;
import com.example.demo.dto.product.owner.OwnerDTO;
import com.example.demo.dto.product.review.ReviewDTO;

import java.util.List;

public record DeviceDetailResponse(
    ProductInformation product,
    DeviceInformation device,
    OwnerDTO owner,
    List<ReviewDTO> reviews // Giữ dạng mảng theo Interface DeviceDetail của FE
) {
}
