package com.example.demo.exception;

import com.example.demo.dto.MyApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
@RequiredArgsConstructor
public class GlobalExceptionHandler {
    private final MessageSource messageSource;

    @ExceptionHandler(value = AppException.class)
    public ResponseEntity<MyApiResponse<Object>> handleAppException(AppException e) {
        ErrorCode errorCode = e.getErrorCode();

        MyApiResponse<Object> myApiResponse = MyApiResponse.builder()
            .code(errorCode.getCode())
            .message(messageSource.getMessage(errorCode.getKeyMessage(), null, LocaleContextHolder.getLocale()))
            .build();

        // ResponseEntity include Header, Body, Status Code
        // ApiResponse are in JSON format
        return ResponseEntity
            .status(errorCode.getStatusCode())
            .body(myApiResponse);
    }
}
