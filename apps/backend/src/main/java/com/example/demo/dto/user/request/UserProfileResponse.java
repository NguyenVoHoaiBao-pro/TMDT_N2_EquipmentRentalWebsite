// @/dto/user/response/UserProfileResponse.java
package com.example.demo.dto.user.request;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class UserProfileResponse {
    // Dữ liệu chung & Tab 1 (Thông tin)
    private String username;
    private String fullName;
    private String email;
    private String phoneNumber;
    private String avatarUrl;
    private List<String> roles;
    private double trustScore;

    // Dữ liệu Tab 3 (Xác minh - Trả về lượt xác minh mới nhất hoặc lượt đang VERIFIED)
    private String kycCardNumber;
    private String kycStatus;
    private String kycVerifiedAt;
}
