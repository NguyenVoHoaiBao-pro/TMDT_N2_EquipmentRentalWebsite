package com.example.demo.service;

import com.example.demo.dto.product.response.ProductResponse;
import com.example.demo.entity.Product;
import com.example.demo.entity.ProductImage;
import com.example.demo.repository.IProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final IProductRepository productRepository;
    private final PaginationHelper paginationHelper;

    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of("id", "name", "pricePerDay", "status");

    public Page<ProductResponse> getAllProducts(Pageable rawPageable) {

        // 1. Move its value to helper to ensure safe pagination
        Pageable safePageable = paginationHelper.makeSafePagination(
            rawPageable,
            ALLOWED_SORT_FIELDS,
            "name",
            Sort.Direction.ASC
        );

        // 2. Query database
        Page<Product> productPaged = productRepository.findAll(safePageable);

        // 3. map to response
        return productPaged.map(product -> {
            String primaryUrl = product.getImages().stream()
                .filter(ProductImage::isPrimary)
                .map(ProductImage::getImageUrl)
                .findFirst()
                .orElse(null);

            return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .pricePerDay(product.getPricePerDay())
                .status(product.getStatus().name())
                .primaryImageUrl(primaryUrl)
                .build();
        });
    }
}
