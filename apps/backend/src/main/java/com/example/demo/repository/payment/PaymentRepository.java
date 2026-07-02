package com.example.demo.repository.payment;

import com.example.demo.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    // Tìm kiếm giao dịch dựa trên Token nội bộ (Dùng khi VNPay/MoMo gọi lại IPN)
    Optional<Payment> findByPaymentToken(String paymentToken);

    List<Payment> findAllByOrderByCreatedAtDesc();

    @Query("SELECT p FROM Payment p JOIN FETCH p.order o JOIN FETCH o.renter ORDER BY p.createdAt DESC")
    List<Payment> findAllWithOrderAndRenter();
}
