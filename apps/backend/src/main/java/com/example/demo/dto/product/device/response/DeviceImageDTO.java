package com.example.demo.dto.product.device.response;

// Khớp với interface ProductImage trên FE
public record DeviceImageDTO(
    Long id,
    String imageUrl,
    boolean isPrimary
) {
}
