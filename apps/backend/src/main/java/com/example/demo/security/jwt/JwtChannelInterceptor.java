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

        // Check if the message is a CONNECT command
        if (accessor != null && StompCommand.CONNECT.equals(accessor.getCommand())) {
            // Retrieve the Authorization header from STOMP
            String bearerToken = accessor.getFirstNativeHeader("Authorization");

            if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
                String token = bearerToken.substring(7);

                try {

                    if (tokenProvider.validateToken(token)) {

                        String username = tokenProvider.getUsernameFromToken(token);

                        UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                        UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

                        // Set the authenticated user in the accessor
                        accessor.setUser(authentication);
                        log.info("WebSocket Authenticated thành công cho user: {}", username);
                    }
                } catch (Exception e) {
                    log.error("Xác thực JWT trên WebSocket thất bại: {}", e.getMessage());
                }
            }
        }
        return message;
    }
}
