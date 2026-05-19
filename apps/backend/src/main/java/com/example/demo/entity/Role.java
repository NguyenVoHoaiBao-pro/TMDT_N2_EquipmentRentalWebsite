package com.example.demo.entity;

import com.example.demo.enumValues.RoleType;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "roles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Role extends BaseEntity{

    @Enumerated(EnumType.STRING)
    @Column(name = "role_name", unique = true, nullable = false)
    private RoleType role;
}
