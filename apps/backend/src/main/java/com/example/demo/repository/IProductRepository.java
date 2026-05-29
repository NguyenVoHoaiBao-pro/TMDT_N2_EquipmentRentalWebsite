package com.example.demo.repository;

import com.example.demo.entity.Product;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;

import java.math.BigDecimal;

public interface IProductRepository extends JpaRepository<Product, Long> {

    Page<Product> findByCategoryId(Long categoryId, Pageable pageable);

    Page<Product> findByNameContainingIgnoreCase(String name, Pageable pageable);

    Page<Product> findByPricePerDayBetween(BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable);

}
