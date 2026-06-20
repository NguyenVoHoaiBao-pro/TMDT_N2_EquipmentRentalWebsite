import { useEffect } from 'react';
import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '@/store/useAuthStore';
import { ScrollArea } from '@/shared_components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/shared_components/ui/avatar';

export default function RoomList() {
  const { rooms, activeRoomId, fetchRooms, selectRoom } = useChatStore();
  const currentUser = useAuthStore((state) => state.user);

  useEffect(() => {
    fetchRooms().then(r => {
      console.log('Error when fetch rooms: ', r);
    });
  }, [fetchRooms]);

  return (
    <div className="w-80 border-r border-border h-full flex flex-col bg-card">
      <div className="p-4 border-b border-border font-semibold text-lg text-foreground text-left">
        Chat Dialogs
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {rooms.map((room) => {
            // Identify the chat partner based on the current user's username'
            const isRenter = currentUser?.username === room.renterName;
            const chatPartnerName = isRenter ? room.ownerName : room.renterName;

            return (
              <button
                key={room.id}
                onClick={() => selectRoom(room.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left ${
                  activeRoomId === room.id
                    ? 'bg-accent text-accent-foreground'
                    : 'hover:bg-muted text-foreground'
                }`}
              >
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/10 text-primary uppercase font-medium">
                    {chatPartnerName.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate text-sm">{chatPartnerName}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    Product: {room.productName}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
