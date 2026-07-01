package com.example.demo.dto.user.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
@Builder
public class UserResponse {
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String avatarUrl;
    private boolean enabled;
    private Set<String> roles;
}
