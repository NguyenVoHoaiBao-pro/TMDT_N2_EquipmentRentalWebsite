package com.example.demo.dto.product.response;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record DeviceDetailResponse(
    Long id,
    String productName,
    String ownerName,
    BigDecimal trustScore,
    Integer conditionPercent,
    BigDecimal pricePerDay,
    BigDecimal depositValue,
    String primaryImageUrl,
    List<String> realShotSubImages,
    List<LocalDate> blockedDates
) {
}
