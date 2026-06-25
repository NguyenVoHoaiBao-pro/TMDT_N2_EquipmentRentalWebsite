package com.example.demo.service;

import com.example.demo.dto.auth.request.RegisterRequest;
import com.example.demo.dto.user.request.BasicProfileRequest;
import com.example.demo.dto.user.request.ChangePasswordRequest;
import com.example.demo.dto.user.request.KycVerificationRequest;
import com.example.demo.dto.user.response.UserProfileResponse;
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
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new AppException(ErrorCode.EMAIL_ALREADY_EXISTS);
        }
        if (request.getPhoneNumber() != null && userRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            throw new AppException(ErrorCode.PHONE_ALREADY_EXISTS);
        }

        Role defaultRole = roleRepository.findByRole(RoleType.RENTER)
            .orElseThrow(() -> new AppException(ErrorCode.DEFAULT_ROLE_NOT_FOUND));

        User newUser = userMapper.mapToEntity(request);


        newUser.setPassword(passwordEncoder.encode(request.getPassword()));
        newUser.setRoles(Set.of(defaultRole));
        newUser.setEnabled(true);

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
            if (userRepository.existsByPhoneNumber(request.getPhoneNumber())) {
                throw new AppException(ErrorCode.PHONE_ALREADY_EXISTS);
            }
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

        String frontImageUrl = "";
        if (request.getIdCardFrontFile() != null && !request.getIdCardFrontFile().isEmpty()) {
            frontImageUrl = cloudinaryService.uploadFile(request.getIdCardFrontFile());
        }

        String backImageUrl = "";
        if (request.getIdCardBackFile() != null && !request.getIdCardBackFile().isEmpty()) {
            backImageUrl = cloudinaryService.uploadFile(request.getIdCardBackFile());
        }

        UserKycVerification kycVerification = UserKycVerification.builder()
            .user(user)
            .idCardNumber(request.getIdCardNumber())
            .idCardFrontUrl(frontImageUrl)
            .idCardBackUrl(backImageUrl)
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

        if (user.getPassword() != null) {
            // Normal login
            if (request.getOldPassword() == null || request.getOldPassword().isBlank()) {
                throw new AppException(ErrorCode.VALIDATION_ERROR);
            }
            if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
                throw new AppException(ErrorCode.PASSWORD_INCORRECT);
            }
        } else {
            // Social login
            if (request.getNewPassword() == null || request.getNewPassword().isBlank()) {
                throw new AppException(ErrorCode.VALIDATION_ERROR);
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

        // Find the latest record of KYC verification
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
