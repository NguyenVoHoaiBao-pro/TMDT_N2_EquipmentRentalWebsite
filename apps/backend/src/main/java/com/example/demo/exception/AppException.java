package com.example.demo.exception;

import lombok.Getter;

@Getter
public class AppException extends RuntimeException {

    private final ErrorCode errorCode;

    public AppException(ErrorCode errorCode) {
        super(errorCode.getKeyMessage()); // Move up to super class
        this.errorCode = errorCode;
    }
}
