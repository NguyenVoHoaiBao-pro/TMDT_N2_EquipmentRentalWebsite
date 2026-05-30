package com.example.demo.controller;

import com.example.demo.dto.MyApiResponse;
import com.example.demo.dto.product.request.ProductFilterRequest;
import com.example.demo.dto.product.response.ProductResponse;
import com.example.demo.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

import java.math.BigDecimal;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController extends BaseController {

    private final ProductService productService;
    private final MessageSource messageSource;

    @GetMapping
    @io.swagger.v3.oas.annotations.security.SecurityRequirements
    public ResponseEntity<MyApiResponse<Page<ProductResponse>>> getAll(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(required = false) String sortBy,
        @RequestParam(defaultValue = "ASC") String orderBy,

        // Filter params:
        @RequestParam(required = false) Long categoryId,
        @RequestParam(required = false) String search,
        @RequestParam(required = false) BigDecimal minPrice,
        @RequestParam(required = false) BigDecimal maxPrice
    ) {
        Sort.Direction direction = "DESC".equalsIgnoreCase(orderBy) ? Sort.Direction.DESC : Sort.Direction.ASC;


        Pageable rawPageable = (sortBy != null && !sortBy.trim().isEmpty())
            ? PageRequest.of(page, size, Sort.by(direction, sortBy))
            : PageRequest.of(page, size);

        ProductFilterRequest filter = new ProductFilterRequest(
            categoryId,
            search,
            minPrice,
            maxPrice
        );

        return createResponse(HttpStatus.OK, 1000, "Success", productService.getProducts(filter, rawPageable));
    }
}
