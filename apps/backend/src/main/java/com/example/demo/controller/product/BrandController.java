package com.example.demo.controller.product;

import com.example.demo.controller.BaseController;
import com.example.demo.dto.MyApiResponse;
import com.example.demo.entity.Brand;
import com.example.demo.service.product.BrandService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/brands")
@RequiredArgsConstructor
public class BrandController extends BaseController {
    private final BrandService brandService;

    @GetMapping
    public ResponseEntity<MyApiResponse<List<Brand>>> getAllBrands() {
        return createResponse(HttpStatus.OK, 1000, "Success", brandService.getAllBrands());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<MyApiResponse<Brand>> createBrand(@RequestBody Brand brand) {
        return createResponse(HttpStatus.CREATED, 1000, "Brand created", brandService.createBrand(brand));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<MyApiResponse<Brand>> updateBrand(@PathVariable Long id, @RequestBody Brand brand) {
        return createResponse(HttpStatus.OK, 1000, "Brand updated", brandService.updateBrand(id, brand));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<MyApiResponse<Void>> deleteBrand(@PathVariable Long id) {
        brandService.deleteBrand(id);
        return createResponse(HttpStatus.OK, 1000, "Brand deleted", null);
    }
}
