package com.example.demo.service.payment.impl;

import com.example.demo.entity.Order;
import com.example.demo.service.payment.PaymentService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Map;

@Service("CASHPaymentService")
public class CashPaymentService implements PaymentService {
    @Override
    public String createPaymentUrl(Order order, BigDecimal amount, String paymentToken, HttpServletRequest httpServletRequest) {
        // Tiền mặt không cần chuyển trang, trả về link trang success của Frontend của bạn luôn
        return "http://localhost:3000/checkout/success?orderId=" + order.getId();
    }

    @Override
    public boolean processCallback(Map<String, String> callbackData) {
        return true;
    }
}
