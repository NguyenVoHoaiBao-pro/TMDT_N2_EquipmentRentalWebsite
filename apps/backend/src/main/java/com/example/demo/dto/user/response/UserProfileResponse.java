// @/dto/user/response/UserProfileResponse.java
package com.example.demo.dto.user.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class UserProfileResponse {
    // Main data
    private String username;
    private String fullName;
    private String email;
    private String phoneNumber;
    private String avatarUrl;
    private List<String> roles;
    private double trustScore;

    // KYC data
    private String kycCardNumber;
    private String kycStatus;
    private String kycVerifiedAt;
}
