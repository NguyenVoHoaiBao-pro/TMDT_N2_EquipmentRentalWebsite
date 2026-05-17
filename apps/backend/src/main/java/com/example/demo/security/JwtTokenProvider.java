package com.example.demo.security;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;

import com.example.demo.exception.AppException;
import com.example.demo.exception.ErrorCode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class JwtTokenProvider {

    @Value("${app.jwtSecret:MySecretKeyThatIsAtLeast32CharactersLongForHS256}")
    private String jwtSecret;

    @Value("${app.jwtExpirationMs:86400000}") // Default: 24 hours
    private long jwtExpirationMs;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }

    /**
     * Generate JWT token from Authentication
     */
    public String generateToken(Authentication authentication) {
        CustomUserDetails userPrincipal = (CustomUserDetails) authentication.getPrincipal();

        Date expiryDate = new Date(System.currentTimeMillis() + jwtExpirationMs);

        assert userPrincipal != null;
        return Jwts.builder()
            .subject(userPrincipal.getUsername())
            .claim("roles", userPrincipal.getAuthorities()
                .stream()
                .map(GrantedAuthority::getAuthority)
                .toList())

            .claim("email", userPrincipal.getEmail())
            .issuedAt(new Date())
            .expiration(expiryDate)
            .signWith(getSigningKey())
            .compact();
    }

    /**
     * Generate JWT token from username
     * We use this method for
     * 1. Oauth2 feature
     * 2. After token jwt expired in 1 day,
     * user request, we use this method to generate a new access token for the user without needing to log in again
     */
    public String generateTokenFromUsername(String username, String role, String email) {
        Date expiryDate = new Date(System.currentTimeMillis() + jwtExpirationMs);

        return Jwts.builder()
            .subject(username)
            .claim("roles", role)
            .claim("email", email)
            .issuedAt(new Date())
            .expiration(expiryDate)
            .signWith(getSigningKey())
            .compact();
    }

    /**
     * Get username from JWT token
     */
    public String getUsernameFromToken(String token) {
        try {
            return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
        } catch (JwtException | IllegalArgumentException e) {
            log.error("Failed to get username from JWT token: {}", e.getMessage());
            return null;
        }
    }

    /**
     * Get role from JWT token
     * After filter succeed in token verification, we use this method to get roles from token to reduce the weight of a database
     */
    public String getRoleFromToken(String token) {
        try {
            return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .get("roles", String.class);
        } catch (JwtException | IllegalArgumentException e) {
            log.error("Failed to get role from JWT token: {}", e.getMessage());
            return null;
        }
    }

    /**
     * Validate JWT token
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token);
            return true;
        } catch (ExpiredJwtException e) {
            log.error("Expired JWT token: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            log.error("Unsupported JWT token: {}", e.getMessage());
        } catch (MalformedJwtException e) {
            log.error("Malformed JWT token: {}", e.getMessage());
        } catch (JwtException e) {
            log.error("Invalid JWT token: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            log.error("JWT claims string is empty: {}", e.getMessage());
        }
        return false;
    }

    /**
     * Get token expiration time
     */
    public Long getExpirationTime() {
        return jwtExpirationMs;
    }

    /**
     * Get expiration date from JWT token
     */
    public Date getExpirationDateFromToken(String token) {
        try {
            return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getExpiration();
        } catch (JwtException | IllegalArgumentException e) {
            log.error("Failed to get expiration date from JWT token: {}", e.getMessage());
            throw new AppException(ErrorCode.INVALID_KEY);
        }
    }
}
