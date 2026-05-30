package com.example.demo.service;

import com.example.demo.dto.product.request.ProductFilterRequest;
import com.example.demo.dto.product.response.ProductResponse;
import com.example.demo.entity.Product;
import com.example.demo.entity.ProductImage;
import com.example.demo.repository.IProductRepository;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.NonNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final IProductRepository productRepository;
    private final PaginationHelper paginationHelper;

    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of("id", "name", "pricePerDay", "status");

    public Page<ProductResponse> getProducts(ProductFilterRequest filter, Pageable rawPageable) {
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
                .pricePerDay(product.getPricePerDay())
                .status(product.getStatus().name())
                .categoryName(product.getCategory() != null ? product.getCategory().getName() : null)
                .primaryImageUrl(primaryUrl)
                .build();
        });
    }

    private static Specification<Product> getProductSpecification(ProductFilterRequest filter) {
        return (root, query, cb) -> {
            if (query.getResultType() != Long.class && query.getResultType() != long.class) {
                root.fetch("images", JoinType.LEFT);
            }

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
                    cb.greaterThanOrEqualTo(root.get("pricePerDay"), filter.minPrice())
                );
            }

            if (filter.maxPrice() != null) {
                predicate = cb.and(predicate,
                    cb.lessThanOrEqualTo(root.get("pricePerDay"), filter.maxPrice())
                );
            }

            return predicate;
        };
    }
}
