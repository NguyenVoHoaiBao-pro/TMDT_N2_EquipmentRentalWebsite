package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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

    @Column(name = "user_name", nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(name = "full_name", nullable = true)
    private String fullName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "phone_number", nullable = true, length = 10)
    private String phoneNumber;

    @Column(name = "id_card_number", nullable = true, length = 16)
    private String idCardNumber;

    @Column(name = "trust_score", nullable = true, precision = 3, scale = 2)
    private BigDecimal trustScore;

    @ManyToMany(fetch = FetchType.EAGER) // FetchType.EAGER to eagerly load roles
    @JoinTable(name = "user_roles",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "role_id"))
    @Builder.Default // Ensure roles are initialized with an empty set but not null
    private Set<Role> roles = new HashSet<>();

    @Column(nullable = false)
    @Builder.Default
    private boolean enabled = false;
}
