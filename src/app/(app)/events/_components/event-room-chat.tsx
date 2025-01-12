import React, { useEffect, useRef, useState } from 'react';
import { Send, Pin, MoreVertical, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from '@/components/ui/avatar';
import { useEventChat } from '@/hooks/event/use-event-chat';
import { ChatMessage } from '@/types/chat';

interface EventChatRoomProps {
  eventId: string;
  userId: string;
}
const EventChatRoom = ({ eventId, userId }: EventChatRoomProps) => {
  const {
    messages,
    isLoading,
    sendMessage,
    deleteMessage,
    pinMessage,
  } = useEventChat(eventId, userId);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      (messagesEndRef.current as HTMLElement).scrollIntoView({
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatMessageTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleSendMessage = async (e: {
    preventDefault: () => void;
  }) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);
    try {
      await sendMessage(newMessage.trim());
      setNewMessage('');
    } finally {
      setIsSending(false);
    }
  };

  const MessageItem = ({ message }: { message: ChatMessage }) => {
    const isOwnMessage = message.userId === userId;
    const displayName =
      message.user?.name || message.user?.username || 'Anonymous';

    return (
      <div
        className={`flex gap-2 mb-4 ${isOwnMessage ? 'flex-row-reverse' : ''}`}
      >
        <Avatar className="h-8 w-8">
          <AvatarImage src={message.user?.avatarUrl || undefined} />
          <AvatarFallback>{displayName.charAt(0)}</AvatarFallback>
        </Avatar>
        <div
          className={`flex flex-col ${isOwnMessage ? 'items-end' : ''}`}
        >
          <div
            className={`flex items-center gap-2 ${isOwnMessage ? 'flex-row-reverse' : ''}`}
          >
            <span className="text-sm font-medium">{displayName}</span>
            <span className="text-xs text-muted-foreground">
              {formatMessageTime(message.createdAt)}
            </span>
          </div>
          <div
            className={`
            max-w-[280px] rounded-lg p-2 mt-1
            ${
              isOwnMessage
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted'
            }
          `}
          >
            <p className="text-sm break-words">{message.content}</p>
          </div>
          {message.isPinned && (
            <div className="flex items-center gap-1 mt-1">
              <Pin className="h-3 w-3" />
              <span className="text-xs">Pinned</span>
            </div>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() =>
                pinMessage(message.id, !message.isPinned)
              }
            >
              {message.isPinned ? 'Unpin Message' : 'Pin Message'}
            </DropdownMenuItem>
            {isOwnMessage && (
              <DropdownMenuItem
                onClick={() => deleteMessage(message.id)}
                className="text-destructive"
              >
                Delete Message
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  };

  return (
    <Card className="w-full max-w-md min-h-[80vh] flex flex-col">
      <CardHeader className="border-b">
        <h3 className="text-lg font-semibold">Event Chat</h3>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-[calc(600px-8rem)] p-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              No messages yet. Start the conversation!
            </div>
          ) : (
            messages.map((message) => (
              <MessageItem key={message.id} message={message} />
            ))
          )}
          <div ref={messagesEndRef} />
        </ScrollArea>
        <form
          onSubmit={handleSendMessage}
          className="p-4 border-t flex gap-2"
        >
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={isSending}
          />
          <Button
            type="submit"
            size="icon"
            disabled={isSending || !newMessage.trim()}
          >
            {isSending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default EventChatRoom;
