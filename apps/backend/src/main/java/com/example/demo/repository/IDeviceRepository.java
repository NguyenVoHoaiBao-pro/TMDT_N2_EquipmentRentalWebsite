package com.example.demo.repository;

import com.example.demo.entity.Device;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.Optional;

public interface IDeviceRepository extends JpaRepository<Device, Long> {

    @Query("SELECT MIN(d.pricePerDay) FROM Device d " +
        "WHERE d.product.id = :productId AND d.status = 'APPROVED'")
    Optional<BigDecimal> findMinPriceByProductId(@Param("productId") Long productId);
}
