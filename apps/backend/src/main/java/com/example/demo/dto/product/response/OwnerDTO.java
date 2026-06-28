package com.example.demo.dto.product.response;

import java.time.LocalDateTime;

public record OwnerDTO(
    Long id,
    String fullName,
    String avatarUrl,
    boolean verified
) {
}

