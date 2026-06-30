package com.example.demo.dto.product.review;

import java.time.Instant;

public record ReviewDTO(
    Long id,
    String username,   // Lấy từ bảng users thông qua author_id
    int rating,
    String comment,
    Instant createdAt
) {
}
