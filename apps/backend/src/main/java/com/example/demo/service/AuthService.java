package com.example.demo.service;

import com.example.demo.dto.auth.request.TokenRefreshRequest;
import com.example.demo.dto.auth.response.JwtResponse;
import com.example.demo.dto.auth.request.LoginRequest;
import com.example.demo.dto.auth.response.TokenRefreshResponse;
import com.example.demo.entity.User;
import com.example.demo.exception.AppException;
import com.example.demo.exception.ErrorCode;
import com.example.demo.repository.IUserRepository;
import com.example.demo.security.JwtTokenProvider;
import com.example.demo.security.UserTokenInfo;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.MalformedJwtException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {
    private final AuthenticationManager manager;
    private final JwtTokenProvider tokenProvider;
    private final IUserRepository userRepository;

    private final ObjectMapper objectMapper;

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
            User user = userRepository.findByUsername(loginRequest.getUsername()).orElseThrow(
                () -> new AppException(ErrorCode.USER_NOT_FOUND)
            );

            /*
            We will use new Object to store user's role and email' in redis
            so that we not need to query the database every time we need to get user's role and email.
             */

            List<String> roles = user.getRoles().stream()
                .map(r -> r.getRole().name())
                .toList();

            UserTokenInfo userInfo = UserTokenInfo.builder()
                .username(user.getUsername())
                .email(user.getEmail())
                .roles(roles)
                .build();

            String jsonTokenInfo = objectMapper.writeValueAsString(userInfo);

            // Create and add a refresh token to the response
            String refreshToken = UUID.randomUUID().toString();
            long ttl = tokenProvider.getRefreshTokenExpirationTime();

            redisTemplate.opsForValue().set("refresh_token:" + refreshToken, jsonTokenInfo,
                ttl, TimeUnit.MILLISECONDS);


            // 4. Build and return JWT response
            return JwtResponse.builder()
                .token(token)
                .type("Bearer")
                .expiresIn(tokenProvider.getExpirationTime())
                .username(user.getUsername())
                .role(user.getRoles().stream()
                    .map(r -> r.getRole().name())
                    .collect(Collectors.joining(",")))
                .refreshToken(refreshToken)
                .build();
        } catch (AuthenticationException e) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        } catch (JsonProcessingException e) {
            log.error("Failed to convert UserTokenInfo to JSON: {}", e.getMessage());
            throw new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION);
        }
    }

    public void logout(String authorizationHeader, String refreshToken) {
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
                // Store token to redis as a key, set expired ttl to the same as
                // the token's remaining time to live (TTL)
                redisTemplate.opsForValue().set("blacklisted:" + token, "true", ttl,
                    TimeUnit.MILLISECONDS);
            }

            // 3. Release the refresh token from redis
            if (StringUtils.hasText(refreshToken)) {
                String redisKey = "refresh_token:" + refreshToken;
                redisTemplate.delete(redisKey);
                log.info("Refresh token has been released from Redis.");
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

    public TokenRefreshResponse refreshToken(TokenRefreshRequest request) {
        String requestTokenRequest = request.getRefreshToken();
        String redisKey = "refresh_token:" + requestTokenRequest;

        // 1. Retrieve json from redis
        String jsonTokenInfo = redisTemplate.opsForValue().get(redisKey);

        if (jsonTokenInfo == null) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        try {
            // 2. Use Jackson to convert a JSON string to a UserTokenInfo object
            UserTokenInfo userInfo = objectMapper.readValue(jsonTokenInfo, UserTokenInfo.class);

            // 3. Generate a new Access Token and Refresh Token
            String rolesString = String.join(",", userInfo.getRoles());
            String newAccessToken = tokenProvider.generateTokenFromUsername(
                userInfo.getUsername(),
                rolesString,
                userInfo.getEmail()
            );

            String newRefreshToken = UUID.randomUUID().toString();

            // 4. Delete the old Refresh Token from Redis
            redisTemplate.delete(redisKey);

            // 5. Store the new refresh token with new expiration time in Redis
            long ttl = tokenProvider.getRefreshTokenExpirationTime();
            redisTemplate.opsForValue().set("refresh_token:" + newRefreshToken, jsonTokenInfo, ttl, TimeUnit.MILLISECONDS);

            // 6. Phản hồi cặp mã mới về cho phía Client (Frontend)
            return TokenRefreshResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .build();

        } catch (com.fasterxml.jackson.core.JsonProcessingException e) {
            log.error("Failed to parse JSON from Redis: {}", redisKey, e);
            throw new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION);
        }
    }
}
