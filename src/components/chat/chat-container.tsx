'use client';

import { useState, useEffect } from 'react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
// import { supabase } from '@/lib/supabase';
import type {
  ChatMessage,
  ChatSettings as ChatSettingsType,
} from '@/types/chat';
import { sendMessage } from '@/server/actions/chat/mutations';
import { supabase } from '@/lib/supabase/client';
import { ChatSettings } from './chat-settings';
import { MessageList } from './message-list';
import { ChatInput } from './chat-input';

interface ChatContainerProps {
  roomId: string;
  userId: string;
  isHost: boolean;
  isGuest: boolean;
  initialMessages: ChatMessage[];
  initialSettings: ChatSettingsType;
}

export function ChatContainer({
  roomId,
  userId,
  isHost,
  isGuest,
  initialMessages,
  initialSettings,
}: ChatContainerProps) {
  const [messages, setMessages] =
    useState<ChatMessage[]>(initialMessages);
  const [settings, setSettings] = useState(initialSettings);
  const [lastMessageTime, setLastMessageTime] = useState<Date>();
  const { toast } = useToast();

  useEffect(() => {
    const channel = supabase
      .channel(`room:${roomId}:chat`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'ChatMessage',
          filter: `roomId=eq.${roomId}`,
        },
        (payload) => {
          const newMessage = payload.new as ChatMessage;
          setMessages((prev) => [...prev, newMessage]);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'ChatMessage',
          filter: `roomId=eq.${roomId}`,
        },
        (payload) => {
          const updatedMessage = payload.new as ChatMessage;
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === updatedMessage.id ? updatedMessage : msg
            )
          );
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'ChatSettings',
          filter: `roomId=eq.${roomId}`,
        },
        (payload) => {
          setSettings(payload.new as ChatSettingsType);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId]);

  const handleSendMessage = async (content: string) => {
    try {
      await sendMessage(roomId, userId, content);
      setLastMessageTime(new Date());

      if (settings.requireModeration && !isHost) {
        toast({
          title: 'Message Sent',
          description:
            'Your message will be visible after moderation.',
        });
      }
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="space-y-4">
      {isHost && (
        <ChatSettings roomId={roomId} initialSettings={settings} />
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Chat
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <MessageList
            messages={messages.filter(
              (msg) =>
                !settings.requireModeration ||
                msg.userId === userId ||
                isHost
            )}
            currentUserId={userId}
            isHost={isHost}
          />
          <ChatInput
            eventId={roomId}
            userId={userId}
            isGuest={isGuest}
            settings={settings}
            onSendMessage={handleSendMessage}
            lastMessageTime={lastMessageTime}
          />
        </CardContent>
      </Card>
    </div>
  );
}
