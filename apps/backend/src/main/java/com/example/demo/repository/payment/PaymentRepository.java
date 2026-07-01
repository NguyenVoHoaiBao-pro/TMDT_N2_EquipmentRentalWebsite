package com.example.demo.repository.payment;

import com.example.demo.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    // Tìm kiếm giao dịch dựa trên Token nội bộ (Dùng khi VNPay/MoMo gọi lại IPN)
    Optional<Payment> findByPaymentToken(String paymentToken);
}
