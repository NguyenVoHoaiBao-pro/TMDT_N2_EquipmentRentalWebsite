package com.example.demo.service;

import com.example.demo.dto.product.request.ProductFilterRequest;
import com.example.demo.dto.product.response.ProductResponse;
import com.example.demo.entity.Product;
import com.example.demo.entity.ProductImage;
import com.example.demo.entity.ProductItem;
import com.example.demo.enumValues.ProductItemStatus;
import com.example.demo.repository.IProductRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.criteria.Predicate;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final IProductRepository productRepository;
    private final PaginationHelper paginationHelper;

    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of("id", "name", "basePrice", "status");

    public Page<ProductResponse> getProducts(ProductFilterRequest filter, Pageable rawPageable) {
        // 1. Validate and sanitize the pageable object
        Pageable safePageable = paginationHelper.makeSafePagination(
            rawPageable,
            ALLOWED_SORT_FIELDS,
            "name",
            Sort.Direction.ASC
        );

        Specification<Product> spec = getProductSpecification(filter);

        Page<Product> productPaged = productRepository.findAll(spec, safePageable);

        return productPaged.map(product -> {
            String primaryUrl = product.getImages().stream()
                .filter(ProductImage::isPrimary)
                .map(ProductImage::getImageUrl)
                .findFirst()
                .orElse(null);

            return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .pricePerDay(product.getBasePrice() != null ? product.getBasePrice() : BigDecimal.ZERO)
                .status(String.valueOf(product.getProductItems().stream()
                    .map(ProductItem::getStatus)
                    .anyMatch(status -> status == ProductItemStatus.AVAILABLE))
                )
                .categoryName(product.getCategory() != null ? product.getCategory().getName() : null)
                .primaryImageUrl(primaryUrl)
                .build();
        });
    }

    private static Specification<Product> getProductSpecification(ProductFilterRequest filter) {
        return (root, query, cb) -> {
            Predicate predicate = cb.conjunction();

            if (filter.categoryId() != null) {
                predicate = cb.and(predicate,
                    cb.equal(root.get("category").get("id"), filter.categoryId())
                );
            }

            if (filter.search() != null && !filter.search().isBlank()) {
                String keyword = "%" + filter.search().toLowerCase() + "%";
                predicate = cb.and(predicate,
                    cb.like(cb.lower(root.get("name")), keyword)
                );
            }

            if (filter.minPrice() != null) {
                predicate = cb.and(predicate,
                    cb.greaterThanOrEqualTo(root.get("basePrice"), filter.minPrice())
                );
            }

            if (filter.maxPrice() != null) {
                predicate = cb.and(predicate,
                    cb.lessThanOrEqualTo(root.get("basePrice"), filter.maxPrice())
                );
            }

            return predicate;
        };
    }

    @Transactional
    public void updateBasePrice(Long productId) {

        // 1. If no product is found, throw an exception
        Product product = productRepository.findById(productId).orElseThrow(
            () -> new EntityNotFoundException(String.format("Product with id %d not found", productId))
        );

        // 2. Update the base price of the product
        BigDecimal minPrice = product.getProductItems().stream()
            .filter(item -> item.getStatus() == ProductItemStatus.AVAILABLE)
            .map(ProductItem::getPricePerDay)
            .min(BigDecimal::compareTo)
            .orElse(BigDecimal.ZERO);

        // 3. Save the base price of the product
        product.setBasePrice(minPrice);
        productRepository.save(product);
    }
}
