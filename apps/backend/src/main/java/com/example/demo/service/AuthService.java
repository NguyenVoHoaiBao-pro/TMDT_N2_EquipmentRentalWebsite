package com.example.demo.service;

import com.example.demo.dto.auth.JwtResponse;
import com.example.demo.dto.auth.LoginRequest;
import com.example.demo.entity.User;
import com.example.demo.exception.AppException;
import com.example.demo.exception.ErrorCode;
import com.example.demo.repository.IUserRepository;
import com.example.demo.security.JwtTokenProvider;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.MalformedJwtException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final AuthenticationManager manager;
    private final JwtTokenProvider tokenProvider;
    private final IUserRepository userRepository;

    // Use this for dealing with redis, e.g., store refresh tokens, blacklisted tokens, etc.
    private final StringRedisTemplate redisTemplate;

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

    public void logout(String authorizationHeader) {
        // 1. Check and throw Exception if the token is invalid or expired
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        // 2. Retrieve token from the header
        String token = authorizationHeader.substring(7);

        try {
            Date expirationDate = tokenProvider.getExpirationDateFromToken(token);
            long expiryTime = expirationDate.getTime(); //
            long currentTime = System.currentTimeMillis();
            long ttl = expiryTime - currentTime;

            if (ttl > 0) {
                // Store token to redis as a key, set expired ttl to the same as the token's remaining time to live (TTL)
                redisTemplate.opsForValue().set("blacklisted:" + token, "true", ttl, TimeUnit.MILLISECONDS);
            }

            // the jjwt exception class:
        } catch (ExpiredJwtException e) {
            // Token expired or invalid
            throw new AppException(ErrorCode.UNAUTHORIZED);
        } catch (MalformedJwtException e) {
            // Invalid token format cannot be parsed
            throw new AppException(ErrorCode.INVALID_KEY);
        } catch (JwtException e) {
            throw new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION);
        }

    }
}
