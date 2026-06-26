// chat.types.ts
export interface ChatRoomResponse {
  id: number;
  renterId: number;
  renterName: string;
  ownerId: number;
  ownerName: string;
  productId: number;
  productName: string;
  productSlug: string;
  createdAt: string;
}

export interface ChatRoomRequest {
  ownerId: number;
  productId: number;
}

export interface ChatMessageResponse {
  id: number;
  roomId: number;
  senderId: number;
  senderName: string;
  messageText: string;
  isRead: boolean;
  createdAt: string;
}

export interface ChatMessageRequest {
  roomId: number;
  messageText: string;
}
