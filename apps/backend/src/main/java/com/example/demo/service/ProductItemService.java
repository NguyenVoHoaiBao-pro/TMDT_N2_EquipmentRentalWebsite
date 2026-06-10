package com.example.demo.service;

import com.example.demo.entity.ProductItem;
import com.example.demo.repository.IProductItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@RequiredArgsConstructor
public class ProductItemService {

    private final IProductItemRepository productItemRepository;
    private final ProductService productService; // Tiêm ProductService vào đây

    @Transactional
    public ProductItemResponse createItem(ProductItemRequest request) {
        // 1. Logic chuyển DTO thành Entity và lưu ProductItem con
        ProductItem item = ...
        productItemRepository.save(item);

        // 2. KÍCH HOẠT ĐỒNG BỘ: Gọi sang ProductService để tính lại giá
        productService.updateBasePrice(item.getProduct().getId());

        return convertToResponse(item);
    }

    @Transactional
    public ProductItemResponse updateItem(Long itemId, ProductItemRequest request) {
        ProductItem item = productItemRepository.findById(itemId).orElseThrow(...);

        // Logic cập nhật thông tin (giá, trạng thái...)
        // ...

        productItemRepository.save(item);

        // KÍCH HOẠT ĐỒNG BỘ: Tính lại giá sau khi sửa thông tin
        productService.updateBasePrice(item.getProduct().getId());

        return convertToResponse(item);
    }
}
