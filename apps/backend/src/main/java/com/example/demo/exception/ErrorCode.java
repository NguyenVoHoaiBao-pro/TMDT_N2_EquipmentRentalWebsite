package com.example.demo.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import lombok.Getter;

@Getter
public enum ErrorCode {
    INVALID_KEY(9999, "error.invalid.key", HttpStatus.BAD_REQUEST),
    UNCATEGORIZED_EXCEPTION(9998, "error.uncategorized", HttpStatus.INTERNAL_SERVER_ERROR),


    DEFAULT_ROLE_NOT_FOUND(1001, "error.default_role.not_found", HttpStatus.NOT_FOUND),
    USER_EXISTED(1002, "error.user.existed", HttpStatus.CONFLICT),
    USER_NOT_FOUND(1003, "error.user.not_found", HttpStatus.NOT_FOUND),
    PASSWORD_INCORRECT(1004, "error.password.incorrect", HttpStatus.BAD_REQUEST),
    UNAUTHORIZED(1005, "error.unauthorized", HttpStatus.UNAUTHORIZED),
    VALIDATION_ERROR(1006, "error.validation", HttpStatus.BAD_REQUEST),
    FORBIDDEN(1007, "error.forbidden", HttpStatus.FORBIDDEN),
    UNPROCESSABLE(1008, "error.unprocessable", HttpStatus.UNPROCESSABLE_CONTENT),
    SERVICE_UNAVAILABLE(1009, "error.service_unavailable", HttpStatus.SERVICE_UNAVAILABLE),
    KYC_ALREADY_PENDING(1010, "error.kyc_already_pending", HttpStatus.CONFLICT);
    private final int code;            // Internal code
    private final String keyMessage;   // Key for multi-language
    private final HttpStatusCode statusCode; // Real status code

    ErrorCode(int code, String keyMessage, HttpStatusCode statusCode) {
        this.code = code;
        this.keyMessage = keyMessage;
        this.statusCode = statusCode;
    }
}
