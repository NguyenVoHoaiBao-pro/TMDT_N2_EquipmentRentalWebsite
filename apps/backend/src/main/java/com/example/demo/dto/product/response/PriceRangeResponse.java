package com.example.demo.dto.product.response;

import java.math.BigDecimal;

public record PriceRangeResponse(BigDecimal minPrice, BigDecimal maxPrice) {
}
