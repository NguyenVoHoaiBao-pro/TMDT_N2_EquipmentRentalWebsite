package com.example.demo.dto.product.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record ItemImageRequest(
    @NotBlank(message = "{image_url.not.blank}")
    String imageUrl,

    @NotBlank(message = "{image_type.not.blank}")
    @Pattern(regexp = "REAL_SHOT|SERIAL_PROOF", message = "{image_type.invalid}")
    String imageType
) {
}
