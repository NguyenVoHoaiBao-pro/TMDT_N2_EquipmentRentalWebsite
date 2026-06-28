package com.example.demo.dto.product.device.response;

import java.math.BigDecimal;
import java.util.List;

public record DeviceInformation(
    Long id,
    Long ownerId,
    int conditionPercent,
    String availability, // Logic tính toán: AVAILABLE, RESERVED, RENTED, MAINTENANCE
    BigDecimal pricePerDay,
    BigDecimal depositValue,
    BigDecimal insurance, // Nếu DB chưa có trường này, bạn có thể hardcode hoặc bổ sung cột vào bảng devices
    List<DeviceImageDTO> images
) {
}

