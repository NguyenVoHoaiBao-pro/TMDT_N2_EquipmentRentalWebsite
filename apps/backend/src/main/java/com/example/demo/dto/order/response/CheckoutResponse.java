package com.example.demo.dto.order.response;

import java.math.BigDecimal;

public record CheckoutResponse(
    Long orderId,
    BigDecimal totalPrice,
    String paymentUrl, // ĐƯỜNG LINK DẪN SANG VNPAY/MOMO SANDBOX
    String paymentToken // UUID bạn tự sinh để quản lý phiên
) {
}
