package com.example.demo.dto.product.review;

import java.time.Instant;

public record ReviewDTO(
    Long id,
    String username,
    int rating,
    String comment,
    Instant createdAt
) {
}
