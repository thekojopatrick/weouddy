"use client";

import { FC, useRef, useEffect } from "react";
import { ChatMessage } from "@/types/chat";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
import { ChatMessageItem } from "./chat-message";

interface ChatMessagesProps {
  messages: ChatMessage[];
  currentUser: {
    id: string;
    name: string;
    username?: string;
    avatarUrl: string;
  };
  isLoading?: boolean;
  onPinMessage: (messageId: string, isPinned: boolean) => void;
  onDeleteMessage: (messageId: string) => void;
  onReaction?: (messageId: string, emoji: string) => void;
}

export const ChatMessages: FC<ChatMessagesProps> = ({
  messages,
  currentUser,
  isLoading,
  onPinMessage,
  onDeleteMessage,
  onReaction,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[30vh]">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full min-h-[30vh] text-muted-foreground">
        No messages yet. Start the conversation!
      </div>
    );
  }

  return (
    <ScrollArea className="flex px-4 pt-2 md:px-0 flex-col h-[70vh] max-h-[80vh] sm:min-h-[80vh]">
      {messages.map((message) => (
        <ChatMessageItem
          key={message.id}
          message={message}
          isOwnMessage={message.userId === currentUser.id}
          onPinMessage={onPinMessage}
          onDeleteMessage={onDeleteMessage}
          onReaction={onReaction}
          currentUser={currentUser}
        />
      ))}
      <div ref={messagesEndRef} />
    </ScrollArea>
  );
};
