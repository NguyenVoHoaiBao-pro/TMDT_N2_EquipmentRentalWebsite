package com.example.demo.service;

import com.example.demo.dto.product.request.ProductFilterRequest;
import com.example.demo.dto.product.response.ProductResponse;
import com.example.demo.entity.Product;
import com.example.demo.entity.ProductImage;
import com.example.demo.entity.Device;
import com.example.demo.enumValues.DeviceStatus;
import com.example.demo.repository.IProductRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.criteria.Predicate;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final IProductRepository productRepository;
    private final PaginationHelper paginationHelper;

    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of("id", "name", "basePrice", "status");

    @Transactional(readOnly = true)
    public Page<ProductResponse> getProducts(ProductFilterRequest filter, Pageable rawPageable) {
        // 1. Validate và chuẩn hóa phân trang
        Pageable safePageable = paginationHelper.makeSafePagination(
            rawPageable,
            ALLOWED_SORT_FIELDS,
            "name",
            Sort.Direction.ASC
        );

        Specification<Product> spec = getProductSpecification(filter);

        Page<Product> productPaged = productRepository.findAll(spec, safePageable);

        return productPaged.map(product -> {
            // 1. Retrieve primary image URL
            String primaryUrl = product.getImages().stream()
                .filter(ProductImage::isPrimary)
                .map(ProductImage::getImageUrl)
                .findFirst()
                .orElse(null);

            // 2. Check if product has at least one approved device
            boolean hasApprovedDevice = product.getDevices().stream()
                .anyMatch(device -> device.getStatus() == DeviceStatus.APPROVED);

            String statusText = hasApprovedDevice ? "AVAILABLE" : "OUT_OF_STOCK";

            // 3. Build and return ProductResponse
            return new ProductResponse(
                product.getId(),
                product.getName(),
                product.getSlug(),
                product.getCategory() != null ? product.getCategory().getName() : null,
                product.getBrand() != null ? product.getBrand().getName() : null,
                primaryUrl,
                product.getBasePrice() != null ? product.getBasePrice() : BigDecimal.ZERO,
                statusText
            );
        });

    }

    private static Specification<Product> getProductSpecification(ProductFilterRequest filter) {
        return (root, query, cb) -> {
            // TỐI ƯU HIỆU NĂNG: Khi đếm trang (Count Query) thì không Fetch, khi lấy data thì Fetch để chống N+1 Query
            if (Long.class != query.getResultType()) {
                root.fetch("images", jakarta.persistence.criteria.JoinType.LEFT);
                root.fetch("category", jakarta.persistence.criteria.JoinType.LEFT);
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
        Product product = productRepository.findById(productId).orElseThrow(
            () -> new EntityNotFoundException(String.format("Product with id %d not found", productId))
        );

        // Đổi getProductItems() -> getDevices()
        BigDecimal minPrice = product.getDevices().stream()
            .filter(device -> device.getStatus() == DeviceStatus.APPROVED)
            .map(Device::getPricePerDay)
            .min(BigDecimal::compareTo)
            .orElse(BigDecimal.ZERO);

        product.setBasePrice(minPrice);
        productRepository.save(product);
    }
}
