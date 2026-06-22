package com.example.demo.security;

import java.util.*;
import java.util.stream.Collectors;

import com.example.demo.entity.Role;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;
import com.example.demo.entity.User;
import lombok.Getter;

@Getter
public class CustomUserDetails implements UserDetails, OAuth2User {
    private final Long id;
    private final String username;
    private final String password;
    private final String email;
    private final boolean enabled;
    private final Collection<? extends GrantedAuthority> authorities;
    private Map<String, Object> attributes; // Lưu trữ payload thô từ Google/Facebook

    // Constructor cho luồng Đăng nhập truyền thống (Form Login)
    public CustomUserDetails(User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.password = user.getPassword(); // Chấp nhận NULL một cách an toàn nếu là tài khoản Social
        this.email = user.getEmail();
        this.enabled = user.isEnabled();

        List<GrantedAuthority> authList = new ArrayList<>();
        if (user.getRoles() != null) {
            for (Role role : user.getRoles()) {
                authList.add(new SimpleGrantedAuthority("ROLE_" + role.getRole().name()));
            }
        }
        this.authorities = authList;
    }

    // Constructor cho luồng Đăng nhập mạng xã hội (OAuth2)
    public CustomUserDetails(User user, Map<String, Object> attributes) {
        this(user);
        this.attributes = attributes;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    // --- CÁC PHƯƠNG THỨC ĐỊNH DANH CỦA OAUTH2USER ---
    @Override
    public Map<String, Object> getAttributes() {
        return this.attributes;
    }

    @Override
    public String getName() {
        return this.username;
    }

    // --- CÁC TRẠNG THÁI TÀI KHOẢN CỦA USERDETAILS ---
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
