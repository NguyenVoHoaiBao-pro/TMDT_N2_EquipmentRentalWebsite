import { create } from 'zustand';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import axios from 'axios'; // Use Axios for token refresh, avoid infinite loop
import type { ChatRoomResponse, ChatMessageResponse } from '@/features/chat/types/chat.types.ts';
import { chatService } from '../services/chat.service';

interface ChatState {
  rooms: ChatRoomResponse[];
  activeRoomId: number | null;
  messages: ChatMessageResponse[];
  stompClient: Client | null;
  isLoading: boolean;

  // Actions
  fetchRooms: () => Promise<void>;
  selectRoom: (roomId: number) => Promise<void>;
  connectWebSocket: (roomId: number) => Promise<void>;
  disconnectWebSocket: () => void;
  sendMessage: (messageText: string) => void;
}

// Helper function to decode when a token is expired
const isTokenExpired = (token: string | null): boolean => {
  if (!token) return true;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window.atob(base64).split('').map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''),
    );
    const { exp } = JSON.parse(jsonPayload);
    // If it's less than 10 seconds before expiration, consider it expired'
    return Date.now() >= exp * 1000 - 10000;
  } catch {
    return true;
  }
};

export const useChatStore = create<ChatState>((set, get) => ({
  rooms: [],
  activeRoomId: null,
  messages: [],
  stompClient: null,
  isLoading: false,

  fetchRooms: async () => {
    try {
      const rooms = await chatService.getUserRooms();
      set({ rooms });
    } catch (error) {
      console.error('Failed to fetch chat rooms:', error);
    }
  },

  selectRoom: async (roomId: number) => {
    set({ activeRoomId: roomId, isLoading: true });
    try {
      const messages = await chatService.getRoomMessages(roomId);
      set({ messages, isLoading: false });

      // Wait for WebSocket connection to be established
      await get().connectWebSocket(roomId);
    } catch (error) {
      set({ isLoading: false });
      console.error('Failed to select room:', error);
    }
  },

  connectWebSocket: async (roomId: number) => {
    get().disconnectWebSocket();

    let token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    // Check if token is expired and refresh if possible
    if (isTokenExpired(token) && refreshToken) {
      console.log('Token expired. Attempting to refresh token before WebSocket Handshake...');
      try {
        // Call the refresh endpoint directly
        const { data } = await axios.post(`${API_BASE_URL}/auth/refresh-token`, { refreshToken });
        const { accessToken: newAccess, refreshToken: newRefresh } = data.result;

        // Update local storage with new tokens
        localStorage.setItem('token', newAccess);
        localStorage.setItem('refreshToken', newRefresh);
        token = newAccess; // Assign the new token by the new one
        console.log('Refresh Token successful for WebSocket!');
      } catch (refreshError) {
        console.error('Refresh token failed. Redirecting to login...', refreshError);
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return;
      }
    }

    const socket = new SockJS('http://localhost:8080/ws');
    const client = new Client({
      webSocketFactory: () => socket,
      // Put token refresh totally from above here
      connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
      debug: (str) => console.log(str),
      onConnect: () => {
        console.log('Connected to WebSocket with Verified/Fresh Token!');

        client.subscribe(`/topic/room.${roomId}`, (message) => {
          const newMsg: ChatMessageResponse = JSON.parse(message.body);
          set((state) => ({
            messages: [...state.messages, newMsg],
          }));
        });
      },
      onStompError: (frame) => {
        console.error('STOMP Error:', frame);
      },
    });

    client.activate();
    set({ stompClient: client });
  },

  disconnectWebSocket: () => {
    const { stompClient } = get();
    if (stompClient && stompClient.connected) {
      stompClient.deactivate();
      set({ stompClient: null });
      console.log('Disconnected WebSocket.');
    }
  },

  sendMessage: (messageText: string) => {
    const { stompClient, activeRoomId } = get();
    if (!stompClient || !stompClient.connected || !activeRoomId) return;

    stompClient.publish({
      destination: '/app/chat.sendMessage',
      body: JSON.stringify({
        roomId: activeRoomId,
        messageText: messageText,
      }),
    });
  },
}));
