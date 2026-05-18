package com.example.demo.exception;

import com.example.demo.dto.MyApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
@RequiredArgsConstructor
public class GlobalExceptionHandler {
    private final MessageSource messageSource;

    // Use for status code of business logic: E.g: 401, 403, 404, 500
    @ExceptionHandler(value = AppException.class)
    public ResponseEntity<MyApiResponse<Object>> handleAppException(AppException e) {
        ErrorCode errorCode = e.getErrorCode();

        MyApiResponse<Object> myApiResponse = MyApiResponse.builder()
            .code(errorCode.getCode())
            .message(messageSource.getMessage(errorCode.getKeyMessage(),
                null, LocaleContextHolder.getLocale()))
            .build();

        // ResponseEntity include Header, Body, Status Code
        // ApiResponse are in JSON format
        return ResponseEntity
            .status(errorCode.getStatusCode())
            .body(myApiResponse);
    }

    // Specific case for 400 Bad Request
    @ExceptionHandler(value = MethodArgumentNotValidException.class)
    public ResponseEntity<MyApiResponse<Object>> handleValidationException(MethodArgumentNotValidException e) {

        // 1. Create a Map to store the errors response to the client
        Map<String, String> errors = new HashMap<>();
        e.getBindingResult().getFieldErrors().forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));


        // 2. Encapsulate the errors in a MyApiResponse
        MyApiResponse<Object> myApiResponse = MyApiResponse.builder()
            .code(HttpStatus.BAD_REQUEST.value())
            .message("Validation Failed")
            .result(errors)
            .build();

        return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(myApiResponse);
    }
}
