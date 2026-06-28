package com.example.demo.dto.product.response;

import java.util.List;

public record DeviceDetailResponse(
    ProductInformation product,
    DeviceInformation device,
    OwnerDTO owner,
    List<ReviewDTO> reviews // Giữ dạng mảng theo Interface DeviceDetail của FE
) {
}
