package com.example.demo.service;

import com.example.demo.dto.product.core.response.LookupResponse;
import com.example.demo.repository.product.CategoryRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@AllArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    @Transactional(readOnly = true)
    public List<LookupResponse> getAllCategories() {
        return categoryRepository.findAll().stream()
            .map(c -> new LookupResponse(c.getId(), c.getName()))
            .toList();
    }
}
