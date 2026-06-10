package com.example.demo.dto.product.response;

import com.example.demo.dto.product.request.ItemImageRequest;

import java.math.BigDecimal;
import java.util.List;

public record ProductItemManageResponse(
    Long id,
    Long productId,
    String productName,
    String serialNumber, // Hiện đầy đủ để đối chiếu
    Integer conditionPercent,
    BigDecimal pricePerDay,
    BigDecimal depositValue,
    String status, // PENDING_APPROVAL, APPROVED, REJECTED
    List<ItemImageRequest> allImages // Xem được cả ảnh SERIAL_PROOF để admin kiểm duyệt bài
) {
}
