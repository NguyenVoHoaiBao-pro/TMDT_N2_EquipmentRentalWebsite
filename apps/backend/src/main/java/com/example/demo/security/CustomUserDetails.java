package com.example.demo.security;

import java.util.*;
import java.util.stream.Collectors;

import com.example.demo.entity.Role;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.example.demo.entity.User;

import lombok.Getter;

@Getter
public class CustomUserDetails implements UserDetails {
    private final Integer id;
    private final String username;
    private final String password;
    private final String email;
    private final boolean enabled;
    private final Collection<? extends GrantedAuthority> authorities;

    public CustomUserDetails(User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.password = user.getPassword();
        this.email = user.getEmail();
        this.enabled = user.isEnabled();

        List<GrantedAuthority> authList = new ArrayList<>();
        for (Role role : user.getRoles()) {
            authList.add(new SimpleGrantedAuthority("ROLE_" + role.getRole().name()));
        }
        this.authorities = authList;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return enabled;
    }

    public Set<String> getRoles() {
        return authorities.stream()
            .map(GrantedAuthority::getAuthority)
            .collect(Collectors.toSet());
    }
}
