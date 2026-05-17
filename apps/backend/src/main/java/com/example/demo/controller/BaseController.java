package com.example.demo.controller;

import com.example.demo.dto.MyApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

public abstract class BaseController {
    protected <T> ResponseEntity<MyApiResponse<T>> createResponse(HttpStatus status, T data) {
        MyApiResponse<T> response = MyApiResponse.<T>builder()
            .code(1000)
            .result(data)
            .build();
        return ResponseEntity.status(status).body(response);
    }
}
