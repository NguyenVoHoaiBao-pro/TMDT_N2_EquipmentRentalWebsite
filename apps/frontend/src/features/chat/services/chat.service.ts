// chat.service.ts
import apiClient from '@/services/api';
import type { ChatRoomResponse, ChatRoomRequest, ChatMessageResponse } from '@/features/chat/types/chat.types.ts';

export const chatService = {
  /**
   * Create a new chat room or return an existing one if it already exists
   */
  getOrCreateRoom: async (data: ChatRoomRequest): Promise<ChatRoomResponse> => {
    return await apiClient.post('/chat/rooms', data);
  },

  /**
   * Get all chat rooms for the current user
   */
  getUserRooms: async (): Promise<ChatRoomResponse[]> => {
    return await apiClient.get('/chat/rooms');
  },

  /**
   * Reload the entire chat history for a specific room
   */
  getRoomMessages: async (roomId: number): Promise<ChatMessageResponse[]> => {
    return await apiClient.get(`/chat/rooms/${roomId}/messages`);
  },
};
