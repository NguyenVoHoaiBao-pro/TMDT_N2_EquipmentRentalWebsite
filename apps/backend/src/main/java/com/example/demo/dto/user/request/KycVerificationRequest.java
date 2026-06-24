package com.example.demo.dto.user.request;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class KycVerificationRequest {
    private String idCardNumber;
    private MultipartFile idCardFrontFile; // Front of id card
    private MultipartFile idCardBackFile;  // Behind of id card
}
