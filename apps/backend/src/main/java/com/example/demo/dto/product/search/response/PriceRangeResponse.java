package com.example.demo.dto.product.search.response;

import java.math.BigDecimal;

public record PriceRangeResponse(BigDecimal minPrice, BigDecimal maxPrice) {
}
