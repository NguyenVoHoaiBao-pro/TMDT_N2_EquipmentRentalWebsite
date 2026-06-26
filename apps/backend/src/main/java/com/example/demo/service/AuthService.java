package com.example.demo.service;

import com.example.demo.dto.auth.request.ForgotPasswordReq;
import com.example.demo.dto.auth.request.ResetPasswordReq;
import com.example.demo.dto.auth.response.JwtResponse;
import com.example.demo.dto.auth.request.LoginRequest;
import com.example.demo.dto.auth.response.TokenRefreshResponse;
import com.example.demo.entity.User;
import com.example.demo.exception.AppException;
import com.example.demo.exception.ErrorCode;
import com.example.demo.repository.user.UserRepository;
import com.example.demo.security.jwt.JwtTokenProvider;
import com.example.demo.security.UserTokenInfo;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.MalformedJwtException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {
    private final AuthenticationManager manager;
    private final JwtTokenProvider tokenProvider;
    private final UserRepository userRepository;

    private final ObjectMapper objectMapper;

    private final EmailService emailService;

    // Use this for dealing with redis, e.g., store refresh tokens, blacklisted tokens, etc.
    private final StringRedisTemplate redisTemplate;
    private final PasswordEncoder passwordEncoder;

    public JwtResponse login(LoginRequest loginRequest, HttpServletResponse response) {
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
            so that we not need to query the database every time we need to get the user's role and email.
             */

            // 4. Convert User object to UserTokenInfo object
            List<String> roles = user.getRoles().stream()
                .map(r -> r.getRole().name())
                .toList();

            UserTokenInfo userInfo = UserTokenInfo.builder()
                .username(user.getUsername())
                .email(user.getEmail())
                .roles(roles)
                .build();

            String jsonTokenInfo = objectMapper.writeValueAsString(userInfo);

            // Create a refresh token and store it in Redis
            String tokenUuid = UUID.randomUUID().toString();
            String redisKey = String.format("refresh_token:%s:%s", user.getUsername(), tokenUuid);
            long ttl = tokenProvider.getRefreshTokenExpirationTime();
            redisTemplate.opsForValue().set(redisKey, jsonTokenInfo, ttl, TimeUnit.MILLISECONDS);

            // 5. Set redisKey to Cookie
            Cookie cookie = new Cookie("refreshToken", redisKey);
            cookie.setHttpOnly(true);
            cookie.setSecure(false);
            cookie.setPath("/");
            cookie.setMaxAge((int) (ttl / 1000));
            response.addCookie(cookie);

            // 6. Build and return JWT response
            return JwtResponse.builder()
                .token(token)
                .type("Bearer")
                .expiresIn(tokenProvider.getExpirationTime())
                .username(user.getUsername())
                .roles(roles)
                .build();
        } catch (AuthenticationException e) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        } catch (JsonProcessingException e) {
            log.error("Failed to convert UserTokenInfo to JSON: {}", e.getMessage());
            throw new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION);
        }
    }

    public void logout(String authorizationHeader, String redisKeyFromCookie, HttpServletResponse response) {
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

            // 3. Delete key from redis according to the value get from Cookie
            if (StringUtils.hasText(redisKeyFromCookie)) {
                redisTemplate.delete(redisKeyFromCookie);
                log.info("Refresh token has been released from Redis.");
            }

            // 4. Delete Cookie from a client:
            Cookie cookie = new Cookie("refresh_token", null); // Set to null to delete the cookie
            cookie.setPath("/");
            cookie.setHttpOnly(true);
            cookie.setMaxAge(0); // Set the cookie's expiration date to 0 to delete it'
            response.addCookie(cookie);

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

    public TokenRefreshResponse refreshToken(String redisKeyFromCookie, HttpServletResponse response) {

        if (redisKeyFromCookie == null) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        // 1. Retrieve json from redis
        String jsonTokenInfo = redisTemplate.opsForValue().get(redisKeyFromCookie);

        if (jsonTokenInfo == null) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        try {
            // 2. Use Jackson to convert a JSON string to a UserTokenInfo object
            UserTokenInfo userInfo = objectMapper.readValue(jsonTokenInfo, UserTokenInfo.class);

            // 3. Generate a new Access Token and Refresh Token
            String newAccessToken = tokenProvider.generateTokenFromUsername(
                userInfo.getUsername(),
                userInfo.getRoles(),
                userInfo.getEmail()
            );

            /*
            Create a turn around cycle of new Token by deleting and then creating a new one:
             */

            // 4. Delete the old Refresh Token from Redis
            redisTemplate.delete(redisKeyFromCookie);

            // 5. Create a new Refresh Token and store it in Redis
            String tokenUuid = UUID.randomUUID().toString();
            String redisKey = String.format("refresh_token:%s:%s", userInfo.getUsername(), tokenUuid);
            long ttl = tokenProvider.getRefreshTokenExpirationTime();
            redisTemplate.opsForValue().set(redisKey, jsonTokenInfo, ttl, TimeUnit.MILLISECONDS);

            // 6. Set redisKey to Cookie:
            Cookie cookie = new Cookie("refreshToken", redisKey);
            cookie.setHttpOnly(true);
            cookie.setSecure(false);
            cookie.setPath("/");
            cookie.setMaxAge((int) (ttl / 1000));
            response.addCookie(cookie);

            // 7. Return the new Access Token and Refresh Token to the client
            return TokenRefreshResponse.builder()
                .accessToken(newAccessToken)
                .build();

        } catch (com.fasterxml.jackson.core.JsonProcessingException e) {
            log.error("Failed to parse JSON from Redis: {}", redisKeyFromCookie, e);
            throw new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION);
        }
    }

    public void forgotPassword(ForgotPasswordReq request) {

        // 1. Retrieve user's email from the request'
        String email = request.getEmail();

        // 2. Check if the user exists in the database and create a reset token
        Optional<User> userOptional = userRepository.findByEmail(email);

        /*
         * if user not found we log and return not throw any exceptionn
         * to avoid user enumeration and phishing attack.
         */
        if (userOptional.isEmpty()) {
            log.warn("User with email {} not found", email);
            return;
        }

        User user = userOptional.get();
        String resetToken = UUID.randomUUID().toString();

        // 3. Store the reset token in Redis with an expiration time (e.g., 15 minutes)
        String redisKey = "reset_token:" + resetToken;
        redisTemplate.opsForValue().set(redisKey, user.getEmail(), 15, TimeUnit.MINUTES);

        // Create a reset link (you should replace the URL with your frontend's reset password page)
        String resetLink = "http://localhost:5173/reset-password?token=" + resetToken;
        ;

        // Send the reset link to the user's email
        emailService.sendResetPasswordEmail(email, resetLink);
        log.info("Reset link be sent to user's email: {}", email);
    }

    public void resetPassword(ResetPasswordReq request) {
        String token = request.getToken();

        String redisKey = "reset_token:" + token;

        // 1. Search token in redis and retrieve the associated email
        String email = redisTemplate.opsForValue().get(redisKey);

        if (email == null) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        // 2. Extract the User that has that email from the database
        User user = userRepository.findByEmail(email).orElseThrow(
            () -> new AppException(ErrorCode.USER_NOT_FOUND)
        );

        // 3. Encrypt the user password and update the old password with the new one
        String encryptPassword = passwordEncoder.encode(request.getNewPassword());
        user.setPassword(encryptPassword);

        // 4. Save the updated user to the database
        userRepository.save(user);

        // 5. Delete the reset token from redis to avoid reuse
        redisTemplate.delete(redisKey);
        log.info("Password has been reset for user: {}", user.getEmail());
    }
    
}
