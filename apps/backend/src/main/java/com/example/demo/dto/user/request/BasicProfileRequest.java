package com.example.demo.dto.user.request;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class BasicProfileRequest {
    private String phoneNumber;
    private MultipartFile avatarFile;
}
