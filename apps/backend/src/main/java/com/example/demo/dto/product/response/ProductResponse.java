package com.example.demo.dto.product.response;

import java.math.BigDecimal;


public record ProductResponse(
    Long id,
    String name,
    String slug,
    String categoryName,
    String brandName,
    String primaryImageUrl, // Ảnh hãng
    BigDecimal minPricePerDay // Giá thấp nhất trong các máy đang APPROVED để thu hút người thuê
) {
}
