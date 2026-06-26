package com.example.demo.controller;

import com.example.demo.dto.MyApiResponse;
import com.example.demo.dto.product.response.LookupResponse;
import com.example.demo.dto.product.response.PriceRangeResponse;
import com.example.demo.service.BrandService;
import com.example.demo.service.CategoryService;
import com.example.demo.service.product.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/lookups")
@RequiredArgsConstructor
public class LookupController extends BaseController {
    private final CategoryService categoryLookupService;
    private final BrandService brandLookupService;
    private final ProductService productService;

    @GetMapping("/categories")
    public ResponseEntity<MyApiResponse<List<LookupResponse>>> getCategories() {
        return createResponse(HttpStatus.OK, 1000, "Success", categoryLookupService.getAllCategories());
    }

    @GetMapping("/brands")
    public ResponseEntity<MyApiResponse<List<LookupResponse>>> getBrands() {
        return createResponse(HttpStatus.OK, 1000, "Success", brandLookupService.getAllBrands());
    }

    @GetMapping("/price-range")
    public ResponseEntity<MyApiResponse<PriceRangeResponse>> getPriceRange() {
        return createResponse(HttpStatus.OK, 1000, "Success", productService.getProductPriceRange());
    }

}
