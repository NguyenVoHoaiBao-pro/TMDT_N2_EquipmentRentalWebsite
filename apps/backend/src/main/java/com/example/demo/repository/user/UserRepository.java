package com.example.demo.repository.user;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.example.demo.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    // Find user by social provider and user ID
    @Query("SELECT u FROM User u JOIN u.socialAccounts s WHERE s.provider = :provider AND s.providerUserId = :providerUserId")
    Optional<User> findBySocialProviderAndUserId(@Param("provider") String provider, @Param("providerUserId") String providerUserId);

    // Find user with roles and kyc verifications
    @Query("SELECT u FROM User u " +
        "LEFT JOIN FETCH u.roles " +
        "LEFT JOIN FETCH u.kycVerifications " +
        "WHERE u.username = :username")
    Optional<User> findUserWithKycAndRolesByUsername(@Param("username") String username);
}
