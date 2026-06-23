package com.example.demo.security;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.security.jwt.JwtTokenProvider;
import com.example.demo.security.UserTokenInfo;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Component
@RequiredArgsConstructor
@Slf4j
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;
    private final StringRedisTemplate redisTemplate;

    @Value("${app.oauth2.authorized-redirect-uri}")
    private String authorizedRedirectUri;

    @Override
    public void onAuthenticationSuccess(@NonNull HttpServletRequest request, HttpServletResponse response,
                                        @NonNull Authentication authentication) throws IOException, ServletException {

        if (response.isCommitted()) {
            log.debug("Response has already been committed. Unable to redirect to " + authorizedRedirectUri);
            return;
        }

        log.info("OAuth2 Đăng nhập thành công! Tiến hành khởi tạo Token và cấu trúc Redis.");

        // 1. Create JWT Token
        String accessToken = jwtTokenProvider.generateToken(authentication);

        // 2. Extract User information from the Authentication object
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new ServletException("Không tìm thấy người dùng mạng xã hội trong hệ thống."));

        List<String> rolesList = user.getRoles().stream()
            .map(r -> r.getRole().name())
            .toList();

        // 3. Build UserTokenInfo object
        UserTokenInfo userInfo = UserTokenInfo.builder()
            .username(user.getUsername())
            .email(user.getEmail())
            .roles(rolesList)
            .build();

        String jsonTokenInfo = objectMapper.writeValueAsString(userInfo);

        // 4. Generate Refresh Token and store in Redis
        String refreshToken = UUID.randomUUID().toString();
        long ttl = jwtTokenProvider.getRefreshTokenExpirationTime();
        redisTemplate.opsForValue().set("refresh_token:" + refreshToken, jsonTokenInfo, ttl, TimeUnit.MILLISECONDS);

        String rolesString = String.join(",", rolesList);

        // 5. Build URL with query parameters
        String targetUrl = UriComponentsBuilder.fromUriString(authorizedRedirectUri)
            .queryParam("token", accessToken)
            .queryParam("refreshToken", refreshToken)
            .queryParam("username", user.getUsername())
            .queryParam("roles", rolesString)
            .build().toUriString();

        // 6. Redirect to the target URL
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}
