package com.example.demo.controller;

import com.example.demo.entity.Product;
import com.example.demo.service.ProductService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@RestController
@RequestMapping("/products")
public class ProductController extends BaseController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService; // Dependency injection
    }

    @GetMapping("/available")
    public ResponseEntity<List<Product>> getAvailableProducts() {
        List<Product> products = productService.findAvailableProducts();
        return new ResponseEntity<>(products, HttpStatus.OK);
    }
}
