package com.example.demo.dto.user.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
@Builder
public class UserResponse {
    private String username;
    private String email;
    private Set<String> roles;
}
