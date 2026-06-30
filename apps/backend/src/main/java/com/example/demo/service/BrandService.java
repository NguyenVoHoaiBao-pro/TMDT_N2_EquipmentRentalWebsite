package com.example.demo.service;

import com.example.demo.dto.product.core.response.LookupResponse;
import com.example.demo.repository.product.BrandRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BrandService {

    private final BrandRepository brandRepository;

    @Transactional(readOnly = true)
    public List<LookupResponse> getAllBrands() {
        return brandRepository.findAll().stream()
            .map(b -> new LookupResponse(b.getId(), b.getName()))
            .toList();
    }

}
