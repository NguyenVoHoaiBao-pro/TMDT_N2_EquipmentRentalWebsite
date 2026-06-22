package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serial;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User extends BaseEntity implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_name", nullable = false, unique = true)
    private String username;

    @Column(nullable = true) // Đã chuyển thành NULLABLE cho OAuth2
    private String password;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "phone_number", nullable = true, unique = true, length = 20)
    // Đã chuyển thành NULLABLE vì OAuth2 không có sẵn phone
    private String phoneNumber;

    @Column(name = "id_card_number", length = 16)
    private String idCardNumber;

    @Column(name = "trust_score", precision = 3, scale = 2)
    private BigDecimal trustScore;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "user_roles",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    @Builder.Default
    private Set<Role> roles = new HashSet<>();

    // Mối quan hệ mới: Một user có thể liên kết nhiều tài khoản mạng xã hội (Google, Facebook,...)
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private Set<UserSocialAccount> socialAccounts = new HashSet<>();

    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL)
    @Builder.Default
    private Set<Device> ownedItems = new HashSet<>();

    @Column(nullable = false)
    @Builder.Default
    private boolean enabled = false;
}
