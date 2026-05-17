package com.example.demo.service;

import com.example.demo.dto.auth.JwtResponse;
import com.example.demo.dto.auth.LoginRequest;
import com.example.demo.entity.User;
import com.example.demo.exception.AppException;
import com.example.demo.exception.ErrorCode;
import com.example.demo.repository.IUserRepository;
import com.example.demo.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final AuthenticationManager manager;
    private final JwtTokenProvider tokenProvider;
    private final IUserRepository userRepository;

    public JwtResponse login(LoginRequest loginRequest) {
        try {
            // 1. Verify User Credentials with username and password
            Authentication authentication = manager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getUsername(),
                    loginRequest.getPassword()
                )
            );

            // 2. Generate JWT Token if succeeded
            String token = tokenProvider.generateToken(authentication);

            // 3. Retrieve user details from a database and return to the frontend UI
            User user = userRepository.findByUsername(loginRequest.getUsername()).orElseThrow();

            // 4. Build and return JWT response
            return JwtResponse.builder()
                .token(token)
                .type("Bearer")
                .expiresIn(tokenProvider.getExpirationTime())
                .username(user.getUsername())
                .role(user.getRoles().stream()
                    .map(r -> r.getRole().name())
                    .collect(Collectors.joining(",")))
                .build();
        } catch (AuthenticationException e) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }
    }
}
