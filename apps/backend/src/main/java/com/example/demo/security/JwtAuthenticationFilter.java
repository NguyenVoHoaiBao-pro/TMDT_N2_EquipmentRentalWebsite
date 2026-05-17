package com.example.demo.security;

import java.io.IOException;

import com.example.demo.dto.MyApiResponse;
import com.example.demo.exception.ErrorCode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.jspecify.annotations.NonNull;
import org.springframework.context.MessageSource;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;
    private final CustomUserDetailsService customUserDetailsService;

    private final StringRedisTemplate redisTemplate;

    private final MessageSource messageSource;

    // Exclude Swagger UI resources: E.g: /swagger-ui/**,
    // /v3/api-docs/**, /swagger-resources/**, /webjars/***/
    @Override
    protected boolean shouldNotFilter(@NonNull HttpServletRequest request) {
        String path = request.getServletPath();
        return path.startsWith("/swagger-ui")
            || path.startsWith("/v3/api-docs")
            || path.startsWith("/swagger-resources")
            || path.startsWith("/webjars")
            || path.startsWith("/h2-console")
            || path.startsWith("/api/auth");
    }

    @Override
    protected void doFilterInternal(
        @NonNull HttpServletRequest request,
        @NonNull HttpServletResponse response,
        @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        try {
            String jwt = getJwtFromRequest(request);

            // 1. If jwt does not contain a token inside -> Skip and move to the next filter
            if (!StringUtils.hasText(jwt)) {
                filterChain.doFilter(request, response);
                return;
            }

            // 2. If the token is in a blacklisted list -> Block the request at once
            if (Boolean.TRUE.equals(redisTemplate.hasKey("blacklisted:" + jwt))) {
                log.warn("Token be logout (Blacklisted): {}", jwt);
                sendErrorResponse(response, ErrorCode.UNAUTHORIZED);
                return;
            }

            // 3. If the token is valid -> Prepare for authentication user
            if (jwtTokenProvider.validateToken(jwt)) {
                String username = jwtTokenProvider.getUsernameFromToken(jwt);
                UserDetails userDetails = customUserDetailsService.loadUserByUsername(username);

                UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authentication);
                log.debug("Set Spring Security Authenticated user: {}", username);
            }

        } catch (UsernameNotFoundException ex) {
            log.error("Could not set user authentication in security context", ex);
        }

        filterChain.doFilter(request, response);
    }

    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }

    // Helper methods use MyApiResponse be designed before
    private void sendErrorResponse(HttpServletResponse response, ErrorCode errorCode) throws IOException {

        // Auth searches for a message in the message source with the key "error.message"
        String localizedMessage = messageSource.getMessage(
            errorCode.getKeyMessage(),
            null,
            org.springframework.context.i18n.LocaleContextHolder.getLocale()
        );

        // Build MyApiResponse with error code and localized message
        MyApiResponse<Object> errorApiResponse = MyApiResponse.builder()
            .code(errorCode.getCode())
            .message(localizedMessage) // Use the localized message
            .build();

        response.setStatus(errorCode.getStatusCode().value());
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        String jsonResponse = new ObjectMapper().writeValueAsString(errorApiResponse);
        response.getWriter().write(jsonResponse);
    }
}
