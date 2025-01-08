'use client';

import { useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage } from '@/types/chat';
import { MessageItem } from './message-item';

interface MessageListProps {
  messages: ChatMessage[];
  currentUserId: string;
  isHost: boolean;
}

export function MessageList({
  messages,
  currentUserId,
  isHost,
}: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <ScrollArea ref={scrollRef} className="h-[500px] pr-4">
      <div className="space-y-4">
        {messages.map((message) => (
          <MessageItem
            key={message.id}
            message={message}
            isCurrentUser={message.userId === currentUserId}
            isHost={isHost}
          />
        ))}
      </div>
    </ScrollArea>
  );
}
