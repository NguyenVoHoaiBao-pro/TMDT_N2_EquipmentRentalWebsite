package com.example.demo.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.demo.entity.UserSocialAccount;

@Repository
public interface UserSocialAccountRepository extends JpaRepository<UserSocialAccount, Long> {

    // Tìm kiếm liên kết dựa trên loại mạng xã hội và ID người dùng của mạng xã hội đó
    Optional<UserSocialAccount> findByProviderAndProviderUserId(String provider, String providerUserId);

    // Kiểm tra xem ID mạng xã hội này đã có ai đăng ký liên kết trên hệ thống chưa
    boolean existsByProviderAndProviderUserId(String provider, String providerUserId);
}
