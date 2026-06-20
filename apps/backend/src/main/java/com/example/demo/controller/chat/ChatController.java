package com.example.demo.controller.chat;

import com.example.demo.controller.BaseController;
import com.example.demo.dto.MyApiResponse;
import com.example.demo.dto.chat.request.ChatMessageRequest;
import com.example.demo.dto.chat.response.ChatMessageResponse;
import com.example.demo.dto.chat.request.ChatRoomRequest;
import com.example.demo.dto.chat.response.ChatRoomResponse;
import com.example.demo.service.chat.ChatService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/chat")
public class ChatController extends BaseController {

    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate; // Use to send messages to WebSocket clients (React) in real-time

    // =========================================================================
    // 1. REST API Endpoints Layer
    // =========================================================================

    /**
     * Endpoint to create a new chat room (chat with the owner)
     */
    @PostMapping("/rooms")
    public ResponseEntity<MyApiResponse<ChatRoomResponse>> getOrCreateRoom(
        @RequestAttribute("currentUserId") Long currentUserId,
        @Valid @RequestBody ChatRoomRequest request) {

        ChatRoomResponse data = chatService.getOrCreateChatRoom(currentUserId, request);
        return createResponse(HttpStatus.OK, data);
    }

    /**
     * Endpoint retrieve all chat rooms for the current user
     */
    @GetMapping("/rooms")
    public ResponseEntity<MyApiResponse<List<ChatRoomResponse>>> getUserChatRooms(
        @RequestAttribute("currentUserId") Long currentUserId) {

        List<ChatRoomResponse> data = chatService.getChatRoomsForUser(currentUserId);
        return createResponse(HttpStatus.OK, data);
    }

    /**
     * Endpoint to retrieve chat messages for a specific room
     */
    @GetMapping("/rooms/{roomId}/messages")
    public ResponseEntity<MyApiResponse<List<ChatMessageResponse>>> getRoomMessages(@PathVariable Long roomId) {
        List<ChatMessageResponse> data = chatService.getMessagesInRoom(roomId);
        return createResponse(HttpStatus.OK, data);
    }

    // =========================================================================
    // 2. WEBSOCKET API Layer (STOMP MESSAGING)
    // =========================================================================

    /**
     * Get message from the WebSocket client (React) real-time.
     * Destination: /app/chat.sendMessage (the prefix "/app" is defined in WebSocketConfig)
     */
    @MessageMapping("/chat.sendMessage")
    public void handleWebSocketMessage(@Valid ChatMessageRequest request) {
        // 1. Mock senderId (Websocket current not pass throught JWT)
        // One day, we will use JWT to pass senderId
        Long mockSenderId = 1L;

        // 2. Call service to save a message
        ChatMessageResponse savedMessage = chatService.saveMessage(mockSenderId, request);

        // 3. Distribute a message to all users in the room (topic)
        // Even owner and user who subcribe to the room with /topic/room.{roomId} will receive the message at once
        messagingTemplate.convertAndSend("/topic/room." + request.getRoomId(), savedMessage);
    }
}
