package com.example.demo.dto.user.request;

import lombok.Data;

@Data
public class ChangePasswordRequest {
    private String oldPassword; // null for the account with social login
    private String newPassword;
}
