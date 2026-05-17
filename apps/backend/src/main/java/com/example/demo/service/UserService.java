package com.example.demo.service;

import com.example.demo.dto.auth.RegisterRequest;
import com.example.demo.dto.user.UserResponse;
import com.example.demo.entity.Role;
import com.example.demo.entity.User;
import com.example.demo.enumValues.RoleType;
import com.example.demo.exception.AppException;
import com.example.demo.exception.ErrorCode;
import com.example.demo.mappers.IUserMapper;
import com.example.demo.repository.IRoleRepository;
import com.example.demo.repository.IUserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class UserService {

    private final IUserRepository userRepository;
    private final IRoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
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

}
