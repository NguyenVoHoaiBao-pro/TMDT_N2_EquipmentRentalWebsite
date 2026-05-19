package com.example.demo.repository;

import com.example.demo.entity.Product;
import com.example.demo.enumValues.ProductStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IProductRepository extends JpaRepository<Product, Long> {

    // Helper methods:
    List<Product> findByStatus(ProductStatus status);
}
