package com.example.demo.dto.product.response;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record ProductItemDetailResponse(
    Long id,
    String productName,
    String ownerName,
    BigDecimal trustScore, // Điểm uy tín của chủ máy
    Integer conditionPercent,
    BigDecimal pricePerDay,
    BigDecimal depositValue,
    String primaryImageUrl,
    List<String> realShotSubImages, // Chỉ lấy các ảnh có loại là REAL_SHOT
    List<LocalDate> blockedDates // Danh sách các ngày bận để đưa vào UI Calendar
) {
}
