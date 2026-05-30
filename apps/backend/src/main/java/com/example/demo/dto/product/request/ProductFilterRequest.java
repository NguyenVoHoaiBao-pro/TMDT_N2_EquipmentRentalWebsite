package com.example.demo.dto.product.request;

import java.math.BigDecimal;

public record ProductFilterRequest(
    Long categoryId,
    String search,
    BigDecimal minPrice,
    BigDecimal maxPrice

) {
}
