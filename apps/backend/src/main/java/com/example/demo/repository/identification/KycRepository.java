package com.example.demo.repository.identification;

import com.example.demo.entity.UserKycVerification;
import org.springframework.data.jpa.repository.JpaRepository;

public interface KycRepository extends JpaRepository<UserKycVerification, Long> {
}
