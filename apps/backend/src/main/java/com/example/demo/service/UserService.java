package com.example.demo.service;

import com.example.demo.dto.auth.request.RegisterRequest;
import com.example.demo.dto.user.request.BasicProfileRequest;
import com.example.demo.dto.user.request.ChangePasswordRequest;
import com.example.demo.dto.user.request.KycVerificationRequest;
import com.example.demo.dto.user.request.UserProfileResponse;
import com.example.demo.dto.user.response.UserResponse;
import com.example.demo.entity.Role;
import com.example.demo.entity.User;
import com.example.demo.entity.UserKycVerification;
import com.example.demo.enumValues.KycStatus;
import com.example.demo.enumValues.RoleType;
import com.example.demo.exception.AppException;
import com.example.demo.exception.ErrorCode;
import com.example.demo.mappers.IUserMapper;
import com.example.demo.repository.user.RoleRepository;
import com.example.demo.repository.user.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final CloudinaryService cloudinaryService;
    private final IUserMapper userMapper;


    @Transactional
    public UserResponse registerUser(RegisterRequest request) {

        // 1. Check for duplicate username
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }

        // 2. Set default role
        Role defaultRole = roleRepository.findByRole(RoleType.RENTER)
            .orElseThrow(() -> new AppException(ErrorCode.DEFAULT_ROLE_NOT_FOUND));

        // 3. Create user
        User newUser = userMapper.mapToEntity(request);

        // Only need to set password and roles here, as other fields are mapped from the request
        newUser.setPassword(passwordEncoder.encode(request.getPassword())); // Hash the password
        newUser.setRoles(Set.of(defaultRole));
        newUser.setEnabled(true);

        // 4. Save user
        userRepository.save(newUser);

        return userMapper.mapToResponse(newUser);
    }

    public boolean checkUsernameExists(String username) {
        return userRepository.existsByUsername(username.trim());
    }

    public boolean checkEmailExists(String email) {
        return userRepository.existsByEmail(email.trim());
    }

    private String getCurrentUsername() {
        return Optional.ofNullable(SecurityContextHolder.getContext().getAuthentication())
            .filter(Authentication::isAuthenticated)
            .map(Authentication::getName)
            .orElseThrow(() -> new AppException(ErrorCode.UNAUTHORIZED));
    }

    @Transactional
    public void updateBasicProfile(BasicProfileRequest request) {
        String currentName = getCurrentUsername();
        User user = userRepository.findByUsername(currentName)
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        if (request.getAvatarFile() != null && !request.getAvatarFile().isEmpty()) {
            String uploadedImageUrl = cloudinaryService.uploadFile(request.getAvatarFile());
            user.setAvatarUrl(uploadedImageUrl);
        }

        if (request.getPhoneNumber() != null && !request.getPhoneNumber().isBlank()) {
            user.setPhoneNumber(request.getPhoneNumber());
        }
        userRepository.save(user);
    }

    @Transactional
    public void verifyIdentification(KycVerificationRequest request) {
        String currentName = getCurrentUsername();
        User user = userRepository.findByUsername(currentName)
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        boolean hasPending = user.getKycVerifications().stream()
            .anyMatch(kyc -> kyc.getStatus() == KycStatus.PENDING);
        if (hasPending) {
            throw new AppException(ErrorCode.KYC_ALREADY_PENDING);
        }

        // Upload ID card image to Cloudinary, ID CARD need 2 images
        String frontImageUrl = "";
        if (request.getIdCardFrontFile() != null && !request.getIdCardFrontFile().isEmpty()) {
            frontImageUrl = cloudinaryService.uploadFile(request.getIdCardFrontFile());
        }

        UserKycVerification kycVerification = UserKycVerification.builder()
            .user(user)
            .idCardNumber(request.getIdCardNumber())
            .idCardImageUrl(frontImageUrl)
            .status(KycStatus.PENDING)
            .build();

        user.getKycVerifications().add(kycVerification);
        userRepository.save(user);
    }

    @Transactional
    public void updatePassword(ChangePasswordRequest request) {
        String currentName = getCurrentUsername();
        User user = userRepository.findByUsername(currentName)
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        //
        if (user.getPassword() != null) {
            // Case 1: If normal login, check the old password
            if (request.getOldPassword() == null || request.getOldPassword().isBlank()) {
                throw new RuntimeException("Old password is required for non-social accounts.");
            }
            if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
                throw new AppException(ErrorCode.PASSWORD_INCORRECT);
            }
        } else {
            // Case 2: If social login, no need to check old password
            if (request.getNewPassword() == null || request.getNewPassword().isBlank()) {
                throw new RuntimeException("New password is required for social accounts.");
            }
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    // Use to get all user information
    public UserProfileResponse getUserProfile() {
        String currentName = getCurrentUsername();

        User user = userRepository.findUserWithKycAndRolesByUsername(currentName)
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        // Tìm bản ghi KYC mới nhất dựa trên thời gian cập nhật/tạo
        UserKycVerification latestKyc = user.getKycVerifications().stream()
            .max(Comparator.comparing(UserKycVerification::getCreatedAt))
            .orElse(null);

        List<String> rolesList = user.getRoles().stream()
            .map(r -> r.getRole().name())
            .toList();

        return UserProfileResponse.builder()
            .username(user.getUsername())
            .fullName(user.getFullName())
            .email(user.getEmail())
            .phoneNumber(user.getPhoneNumber())
            .avatarUrl(user.getAvatarUrl())
            .roles(rolesList)
            .trustScore(user.getTrustScore() != null ? user.getTrustScore().doubleValue() : 5.0)

            // If the user hasn't added KYC, set to 'NOT_STARTED' for frontend filter
            .kycCardNumber(latestKyc != null ? latestKyc.getIdCardNumber() : null)
            .kycStatus(latestKyc != null ? latestKyc.getStatus().name() : "NOT_STARTED")
            .kycVerifiedAt(latestKyc != null && latestKyc.getVerifiedAt() != null ? latestKyc.getVerifiedAt().toString() : null)
            .build();
    }
}
