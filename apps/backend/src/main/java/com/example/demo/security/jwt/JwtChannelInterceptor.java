package com.example.demo.security.jwt;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;
import org.springframework.context.annotation.Bean;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtChannelInterceptor implements ChannelInterceptor {

    private final JwtTokenProvider tokenProvider;
    private final UserDetailsService userDetailsService; // Gọi đến CustomUserDetailsService của bạn

    @Override
    public Message<?> preSend(@NonNull Message<?> message, @NonNull MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        // Kiểm tra nếu là lệnh CONNECT (khi React bắt đầu thiết lập kết nối realtime)
        if (accessor != null && StompCommand.CONNECT.equals(accessor.getCommand())) {
            // Lấy chuỗi Authorization từ Header của gói tin STOMP
            String bearerToken = accessor.getFirstNativeHeader("Authorization");

            if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
                String token = bearerToken.substring(7);

                try {
                    // 1. Gọi hàm validateToken có sẵn của bạn để kiểm tra tính hợp lệ
                    if (tokenProvider.validateToken(token)) {
                        String username = tokenProvider.getUsernameFromToken(token);

                        // 2. Tải thông tin người dùng từ hệ thống lên
                        UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                        // 3. Tạo đối tượng Authentication chứng thực
                        UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

                        // 4. Đính kèm thông tin User vào context riêng biệt của WebSocket phiên làm việc này
                        accessor.setUser(authentication);
                        log.info("WebSocket Authenticated thành công cho user: {}", username);
                    }
                } catch (Exception e) {
                    log.error("Xác thực JWT trên WebSocket thất bại: {}", e.getMessage());
                    // Bạn có thể quăng lỗi tại đây nếu muốn ngắt kết nối ngay lập tức khi token giả mạo
                }
            }
        }
        return message;
    }
}
