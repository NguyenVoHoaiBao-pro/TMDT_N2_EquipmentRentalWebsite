package com.example.demo.controller;

import com.example.demo.dto.MyApiResponse;
import com.example.demo.dto.auth.request.RegisterRequest;
import com.example.demo.dto.auth.request.TokenRefreshRequest;
import com.example.demo.dto.auth.response.TokenRefreshResponse;
import com.example.demo.dto.user.UserResponse;
import com.example.demo.service.AuthService;
import com.example.demo.service.UserService;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.example.demo.dto.auth.response.JwtResponse;
import com.example.demo.dto.auth.request.LoginRequest;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;


@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Validated // Enable this for validation annotations Eg: @NotBlank
@Tag(name = "Authentication", description = "Authentication endpoints")
public class AuthController extends BaseController {

    private final UserService userService;
    private final AuthService authService;
    private final MessageSource messageSource;

    @PostMapping("/login")
    @Operation(summary = "Login user", description = "Authenticate user and get JWT token")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Login successful"),
        @ApiResponse(responseCode = "401", description = "Invalid credentials"),
        @ApiResponse(responseCode = "404", description = "User not found")
    })
    public ResponseEntity<MyApiResponse<JwtResponse>> login(@Valid @RequestBody LoginRequest loginRequest) {
        return createResponse(HttpStatus.OK, authService.login(loginRequest));
    }

    @PostMapping("/register")
    @Operation(summary = "Register new user", description = "Create a new user account")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "User created successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid user data"),
        @ApiResponse(responseCode = "409", description = "User already exists")
    })

    public ResponseEntity<MyApiResponse<UserResponse>> register(@Valid @RequestBody RegisterRequest request) {

        return createResponse(HttpStatus.CREATED, userService.registerUser(request));
    }

    @PostMapping("/logout")
    @Operation(summary = "Logout user", description = "Invalidate the current JWT token")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Logout successful"),
        @ApiResponse(responseCode = "401", description = "Unauthorized"),
    })
    public ResponseEntity<MyApiResponse<String>> logout(@RequestHeader("Authorization") String headerAuthorization,
                                                        @RequestParam(required = false) String refreshToken) {

        // 1. Execute / Delete blacklisted token and refreshToken(if exists) from redis
        authService.logout(headerAuthorization, refreshToken);

        // 2. Translate a message successfully from the message source
        String localizedMessage = messageSource.getMessage("auth.logout.success", null, LocaleContextHolder.getLocale());

        // 3. New create response with customization
        return createResponse(HttpStatus.OK, 1000, localizedMessage, "Session has been cleared and tokens invalidated successfully.");
    }

    @PostMapping("/refresh")
    @Operation(summary = "Refresh JWT token", description = "Get a new JWT token using a valid refresh token")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Token refreshed successfully"),
        @ApiResponse(responseCode = "401", description = "Invalid refresh token"),
    })
    public ResponseEntity<MyApiResponse<TokenRefreshResponse>> refreshToken(@Valid @RequestBody TokenRefreshRequest request) {

        return createResponse(HttpStatus.OK, authService.refreshToken(request));
    }


    @GetMapping("/check-email")
    @Operation(summary = "Check email existence", description = "Check if an email is already registered")
    public ResponseEntity<MyApiResponse<Boolean>> checkEmail(
        @RequestParam @NotBlank @Email String email) {
        return createResponse(HttpStatus.OK, userService.checkEmailExists(email));
    }

    @GetMapping("/check-username")
    @Operation(summary = "Check username existence", description = "Check if a username is already taken")
    public ResponseEntity<MyApiResponse<Boolean>> checkUsername(@RequestParam @NotBlank String username) {
        return createResponse(HttpStatus.OK, userService.checkUsernameExists(username));
    }
}
