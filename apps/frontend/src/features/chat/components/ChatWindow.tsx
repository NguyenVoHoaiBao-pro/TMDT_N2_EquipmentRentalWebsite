import React, { useState, useRef, useEffect } from 'react';
import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '@/store/useAuthStore';
import { ScrollArea } from '@/shared_components/ui/scroll-area';
import { Input } from '@/shared_components/ui/input';
import { Button } from '@/shared_components/ui/button';
import { Send } from 'lucide-react';

export default function ChatWindow() {
  const { activeRoomId, messages, sendMessage, isLoading, rooms } = useChatStore();
  const currentUser = useAuthStore((state) => state.user);
  const [text, setText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom whenever messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (!activeRoomId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-muted/20 text-muted-foreground">
        Select a chat room to start messaging.
      </div>
    );
  }

  const currentRoom = rooms.find((r) => r.id === activeRoomId);
  const isRenter = currentUser?.username === currentRoom?.renterName;
  const partnerName = isRenter ? currentRoom?.ownerName : currentRoom?.renterName;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    sendMessage(text.trim());
    setText('');
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-background">
      {/* Header Chat Box */}
      <div className="p-4 border-b border-border flex items-center justify-between bg-card">
        <div className="text-left">
          <h3 className="font-semibold text-foreground text-sm">{partnerName}</h3>
          <p className="text-xs text-muted-foreground">Đang trao đổi về: {currentRoom?.productName}</p>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4 bg-muted/10">
        {isLoading ? (
          <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
            Loading messages...
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => {
              const isMe = msg.senderName === currentUser?.username;
              return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[70%] rounded-lg p-3 text-sm shadow-sm ${
                      isMe
                        ? 'bg-primary text-primary-foreground rounded-tr-none'
                        : 'bg-card text-foreground rounded-tl-none border border-border'
                    }`}
                  >
                    <p className="text-left break-words">{msg.messageText}</p>
                    <span className="text-[10px] opacity-70 block text-right mt-1">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })}
            <div ref={scrollRef} />
          </div>
        )}
      </ScrollArea>

      {/* Input Area for Sending Messages */}
      <form onSubmit={handleSend} className="p-4 border-t border-border flex gap-2 bg-card">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter your message..."
          className="flex-1"
        />
        <Button type="submit" size="icon" disabled={!text.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
