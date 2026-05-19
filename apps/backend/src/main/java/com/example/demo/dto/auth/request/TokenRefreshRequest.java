package com.example.demo.dto.auth.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class TokenRefreshRequest {
    @NotBlank(message = "{refresh_token.not.blank}")
    private String refreshToken;
}
