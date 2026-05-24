package com.example.demo.dto;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL) // If a field is null, it won't be included in the response'
public class MyApiResponse<T> {

    private int statusCode;
    private Integer appCode;
    private String message;
    private T result;

    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();
}
