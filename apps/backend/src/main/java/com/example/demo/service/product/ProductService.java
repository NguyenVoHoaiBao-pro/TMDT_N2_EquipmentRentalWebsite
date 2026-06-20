package com.example.demo.service.product;

import com.example.demo.dto.product.request.ProductFilterRequest;
import com.example.demo.dto.product.response.ProductResponse;
import com.example.demo.entity.Product;
import com.example.demo.entity.ProductImage;
import com.example.demo.entity.Device;
import com.example.demo.enumValues.DeviceStatus;
import com.example.demo.repository.product.ProductRepository;
import com.example.demo.service.PaginationHelper;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;
    private final PaginationHelper paginationHelper;

    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of("id", "name", "basePrice", "status");

    @Transactional(readOnly = true)
    public Page<ProductResponse> getProducts(ProductFilterRequest filter, Pageable rawPageable) {
        Pageable safePageable = paginationHelper.makeSafePagination(rawPageable, ALLOWED_SORT_FIELDS, "name", Sort.Direction.ASC);
        Specification<Product> spec = getProductSpecification(filter);
        Page<Product> productPaged = productRepository.findAll(spec, safePageable);

        return productPaged.map(product -> {
            // 1. Retrieve the primary image URL
            String primaryUrl = product.getImages().stream()
                .filter(ProductImage::isPrimary)
                .map(ProductImage::getImageUrl)
                .findFirst()
                .orElse(null);

            // 2. Check if there are approved devices in the product
            boolean hasApprovedDevice = product.getDevices().stream()
                .anyMatch(device -> device.getStatus() == DeviceStatus.APPROVED);
            String statusText = hasApprovedDevice ? "AVAILABLE" : "OUT_OF_STOCK";

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
            Predicate predicate = cb.conjunction();

            if (filter.categoryId() != null) {
                predicate = cb.and(predicate, cb.equal(root.get("category").get("id"), filter.categoryId()));
            }
            if (filter.search() != null && !filter.search().isBlank()) {
                String keyword = "%" + filter.search().toLowerCase() + "%";
                predicate = cb.and(predicate, cb.like(cb.lower(root.get("name")), keyword));
            }
            if (filter.minPrice() != null) {
                predicate = cb.and(predicate, cb.greaterThanOrEqualTo(root.get("basePrice"), filter.minPrice()));
            }
            if (filter.maxPrice() != null) {
                predicate = cb.and(predicate, cb.lessThanOrEqualTo(root.get("basePrice"), filter.maxPrice()));
            }
            return predicate;
        };
    }

    @Transactional
    public void updateBasePrice(Long productId) {
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new EntityNotFoundException("Product not found"));

        BigDecimal minPrice = product.getDevices().stream()
            .filter(device -> device.getStatus() == DeviceStatus.APPROVED)
            .map(Device::getPricePerDay)
            .min(BigDecimal::compareTo)
            .orElse(BigDecimal.ZERO);

        product.setBasePrice(minPrice);
        productRepository.save(product);
    }
}
