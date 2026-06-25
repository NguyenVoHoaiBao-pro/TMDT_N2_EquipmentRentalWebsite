package com.example.demo.dto.user.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RevealKycRequest {

    @NotBlank(message = "{error.password.required}")
    private String password;
}
