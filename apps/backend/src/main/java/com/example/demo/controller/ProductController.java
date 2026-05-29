package com.example.demo.controller;

import com.example.demo.dto.product.response.ProductResponse;
import com.example.demo.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    @io.swagger.v3.oas.annotations.security.SecurityRequirements
    public ResponseEntity<Page<ProductResponse>> getAll(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(required = false) String sortBy,
        @RequestParam(defaultValue = "ASC") String orderBy
    ) {
        Sort.Direction direction = "DESC".equalsIgnoreCase(orderBy) ? Sort.Direction.DESC : Sort.Direction.ASC;


        Pageable rawPageable = (sortBy != null && !sortBy.trim().isEmpty())
            ? PageRequest.of(page, size, Sort.by(direction, sortBy))
            : PageRequest.of(page, size);

        return ResponseEntity.ok(productService.getAllProducts(rawPageable));
    }
}
