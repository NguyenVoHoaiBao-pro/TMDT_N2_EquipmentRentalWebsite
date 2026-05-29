package com.example.demo.dto.product.response;

import java.math.BigDecimal;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder

public class ProductResponse {
    private Long id;
    private String name;
    private BigDecimal pricePerDay;
    private String status;
    private String categoryName;
    private String primaryImageUrl;
}
