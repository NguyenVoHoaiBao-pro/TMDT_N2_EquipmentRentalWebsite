package com.example.demo.dto.product.owner;

public record OwnerDTO(
    Long id,
    String fullName,
    String avatarUrl,
    boolean verified
) {
}

