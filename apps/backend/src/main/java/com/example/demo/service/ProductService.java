package com.example.demo.service;

import com.example.demo.entity.Product;
import com.example.demo.enumValues.ProductStatus;
import com.example.demo.repository.IProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final IProductRepository IProductRepository;

    public ProductService(IProductRepository IProductRepository) {
        this.IProductRepository = IProductRepository; // Dependency injection
    }

    public List<Product> findAvailableProducts() {
        return IProductRepository.findByStatus(ProductStatus.AVAILABLE);
    }
}
