package com.example.demo.dto.product.response;

import java.time.LocalDateTime;

// Khớp với interface Review trên FE
public record ReviewDTO(
    Long id,
    String username,   // Lấy từ bảng users thông qua author_id
    int rating,
    String comment,
    LocalDateTime createdAt
) {
}
