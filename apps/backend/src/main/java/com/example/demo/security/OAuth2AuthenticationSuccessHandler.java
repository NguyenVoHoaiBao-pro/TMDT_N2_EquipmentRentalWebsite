package com.example.demo.security;

import com.example.demo.security.jwt.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

@Component
@RequiredArgsConstructor
@Slf4j
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtTokenProvider jwtTokenProvider;

    // URL của Frontend nhận Token (Cấu hình trong file application.yml)
    // Ví dụ: http://localhost:3000/oauth2/redirect
    @Value("${app.oauth2.authorized-redirect-uri}")
    private String authorizedRedirectUri;

    @Override
    public void onAuthenticationSuccess(@NonNull HttpServletRequest request, HttpServletResponse response,
                                        @NonNull Authentication authentication) throws IOException, ServletException {

        // 1. Kiểm tra nếu phản hồi đã được xử lý ở nơi khác
        if (response.isCommitted()) {
            log.debug("Response has already been committed. Unable to redirect to " + authorizedRedirectUri);
            return;
        }

        log.info("OAuth2 Đăng nhập thành công! Tiến hành khởi tạo Token cho người dùng.");

        // 2. Sinh Access Token sử dụng hàm tạo token dùng chung không cần ép kiểu cứng
        String accessToken = jwtTokenProvider.generateToken(authentication);

        // 3. Xây dựng URL chuyển tiếp kèm theo Token để Frontend bốc tách và lưu vào localStorage/cookie
        String targetUrl = UriComponentsBuilder.fromUriString(authorizedRedirectUri)
            .queryParam("token", accessToken)
            // Bạn có thể bổ sung thêm refreshToken hoặc trạng thái nếu cần thiết
            // .queryParam("refresh_token", refreshToken)
            .build().toUriString();

        // 4. Thực hiện chuyển hướng trình duyệt của người dùng về Frontend
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}
