package com.example.demo.entity;

import com.example.demo.enumValues.KycStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.io.Serial;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_kyc_verifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class UserKycVerification extends BaseEntity {

    @Serial
    private static final long serialVersionUID = 1L;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "id_card_number")
    private String idCardNumber;

    @Column(name = "id_card_front_url")
    private String idCardFrontUrl;

    @Column(name = "id_card_back_url")
    private String idCardBackUrl;

    @Enumerated(EnumType.STRING)
    private KycStatus status;

    @Column(name = "verified_by")
    private Long verified_by;

    @Column(name = "verified_at")
    private LocalDateTime verifiedAt;
}
