package com.example.demo.dto.product.response;

public record ReviewDto(Long id, String username, int rating, String comment, String createdAt) {
}
