package com.example.demo.service;

import com.example.demo.entity.Product;
import com.example.demo.enumValues.ProductStatus;
import com.example.demo.repository.IProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final IProductRepository productRepository;

    public ProductService(IProductRepository productRepository) {
        this.productRepository = productRepository; // Dependency injection
    }

    public List<Product> findAvailableProducts() {
        return productRepository.findByStatus(ProductStatus.AVAILABLE);
    }
}
