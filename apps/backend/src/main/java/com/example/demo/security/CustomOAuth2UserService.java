package com.example.demo.security;

import com.example.demo.entity.Role;
import com.example.demo.entity.User;
import com.example.demo.entity.UserSocialAccount;
import com.example.demo.enumValues.RoleType;
import com.example.demo.exception.AppException;
import com.example.demo.exception.ErrorCode;
import com.example.demo.repository.RoleRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.UserSocialAccountRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class CustomOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserSocialAccountRepository socialAccountRepository;
    private final DefaultOAuth2UserService defaultUserService = new DefaultOAuth2UserService();

    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        // 1. Gọi service mặc định của Spring để lấy thông tin User từ Google API
        OAuth2User oAuth2User = defaultUserService.loadUser(userRequest);

        // 2. Trích xuất các thông tin cơ bản từ Provider (GOOGLE hoặc FACEBOOK)
        String provider = userRequest.getClientRegistration().getRegistrationId().toUpperCase(); // "GOOGLE"
        String providerUserId = oAuth2User.getAttribute("sub"); // Google dùng key 'sub' để định danh user ID
        String email = oAuth2User.getAttribute("email");
        String fullName = oAuth2User.getAttribute("name");
        String avatarUrl = oAuth2User.getAttribute("picture"); // Link ảnh đại diện từ Google

        if (email == null) {
            throw new OAuth2AuthenticationException("Không tìm thấy email từ nhà cung cấp: " + provider);
        }

        // 3. Xử lý logic tìm kiếm hoặc tạo mới User dưới Database
        User user = processUserAuthentication(provider, providerUserId, email, fullName, avatarUrl);

        // 4. Trả về đối tượng CustomUserDetails (Bọc đối tượng User của hệ thống) để đi tiếp luồng tạo Token
        return new CustomUserDetails(user);
    }

    private User processUserAuthentication(String provider, String providerUserId, String email, String fullName, String avatarUrl) {
        // Luồng A: Kiểm tra xem tài khoản Social ID này đã từng đăng nhập trước đây chưa
        Optional<User> userBySocial = userRepository.findBySocialProviderAndUserId(provider, providerUserId);
        if (userBySocial.isPresent()) {
            log.info("Người dùng cũ đăng nhập lại qua Social: {}", email);
            return userBySocial.get();
        }

        // Luồng B: Nếu Social ID chưa có, kiểm tra xem Email này đã tồn tại trong hệ thống chưa (Xử lý trùng email)
        Optional<User> userByEmail = userRepository.findByEmail(email);
        if (userByEmail.isPresent()) {
            User existingUser = userByEmail.get();
            log.info("Email đã tồn tại. Tiến hành liên kết tài khoản Social mới cho: {}", email);

            // Tạo liên kết mới sang bảng phụ user_social_accounts cho user này
            linkSocialAccount(existingUser, provider, providerUserId, avatarUrl);
            return existingUser;
        }

        // Luồng C: Tài khoản hoàn toàn mới -> Tiến hành tạo mới User và liên kết Social
        log.info("Tạo người dùng hoàn toàn mới từ luồng OAuth2: {}", email);
        return createNewOAuth2User(provider, providerUserId, email, fullName, avatarUrl);
    }

    private User createNewOAuth2User(String provider, String providerUserId, String email, String fullName, String avatarUrl) {
        // Lấy role mặc định giống luồng đăng ký truyền thống của bạn (RENTER)
        Role defaultRole = roleRepository.findByRole(RoleType.RENTER)
            .orElseThrow(() -> new AppException(ErrorCode.DEFAULT_ROLE_NOT_FOUND));

        // Tự động sinh tên đăng nhập ngẫu nhiên và không trùng lặp dựa trên email
        String baseUsername = email.split("@")[0];
        String generatedUsername = baseUsername;
        int suffix = 1;
        while (userRepository.existsByUsername(generatedUsername)) {
            generatedUsername = baseUsername + suffix;
            suffix++;
        }

        // Khởi tạo thực thể User (password và phoneNumber mang giá trị null)
        User newUser = User.builder()
            .username(generatedUsername)
            .password(null) // Luồng OAuth2 không tạo mật khẩu tĩnh
            .fullName(fullName != null ? fullName : baseUsername)
            .email(email)
            .phoneNumber(null) // Số điện thoại sẽ yêu cầu cập nhật sau (Profile)
            .trustScore(new BigDecimal("5.00"))
            .roles(Set.of(defaultRole))
            .enabled(true) // Kích hoạt tài khoản ngay vì đã xác thực qua Google
            .build();

        User savedUser = userRepository.save(newUser);

        // Tạo bản ghi lưu vào bảng phụ liên kết mạng xã hội
        linkSocialAccount(savedUser, provider, providerUserId, avatarUrl);

        return savedUser;
    }

    private void linkSocialAccount(User user, String provider, String providerUserId, String avatarUrl) {
        UserSocialAccount socialAccount = UserSocialAccount.builder()
            .user(user)
            .provider(provider)
            .providerUserId(providerUserId)
            .avatarUrl(avatarUrl)
            .build();
        socialAccountRepository.save(socialAccount);
    }
}
