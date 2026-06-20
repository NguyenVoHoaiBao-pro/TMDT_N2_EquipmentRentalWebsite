package com.example.demo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker // Kích hoạt tính năng Message Broker cho WebSocket STOMP
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
            .setAllowedOriginPatterns("http://localhost:5173")
            .withSockJS(); // Alternatively, if the user browser doesn't support WebSocket, fallback to SockJS'
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // Routing for messages sent from the client to the server starting with "/app"
        // E.g: /app/chat.sendMessage
        registry.setApplicationDestinationPrefixes("/app");

        // Routing for incoming messages to specific topics or queues
        // E.g: /topic/room.1
        registry.enableSimpleBroker("/topic", "/queue");
    }
}
