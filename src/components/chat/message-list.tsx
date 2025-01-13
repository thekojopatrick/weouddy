import { FC, useRef, useEffect } from 'react';
import { ChatMessage } from '@/types/chat';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2 } from 'lucide-react';
import { ChatMessageItem } from './chat-message';

interface ChatMessagesProps {
  messages: ChatMessage[];
  currentUserId: string;
  isLoading?: boolean;
  onPinMessage: (messageId: string, isPinned: boolean) => void;
  onDeleteMessage: (messageId: string) => void;
  onReaction?: (messageId: string, emoji: string) => void;
}

export const ChatMessages: FC<ChatMessagesProps> = ({
  messages,
  currentUserId,
  isLoading,
  onPinMessage,
  onDeleteMessage,
  onReaction,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        No messages yet. Start the conversation!
      </div>
    );
  }

  return (
    <ScrollArea className="flex flex-col p-4 h-[80vh] max-h-[80vh] sm:min-h-[80vh]">
      {messages.map((message) => (
        <ChatMessageItem
          key={message.id}
          message={message}
          isOwnMessage={message.userId === currentUserId}
          onPinMessage={onPinMessage}
          onDeleteMessage={onDeleteMessage}
          onReaction={onReaction}
        />
      ))}
      <div ref={messagesEndRef} />
    </ScrollArea>
  );
};
