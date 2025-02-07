import { supabase } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import type { ChatMessage, ChatSettings } from '@/types/chat';

import { createId } from '@paralleldrive/cuid2';

export const useEventChat = (eventId: string, userId: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [settings, setSettings] = useState<ChatSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('Starting chat subscription for eventId:', eventId);
    fetchMessages();
    fetchChatSettings();
    const messageChannel = supabase
      .channel(`event-chat-${eventId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'Message',
          filter: `eventId=eq.${eventId}`,
        },
        (payload) => {
          console.log('INSERT payload:', payload);
          setMessages((prev) => [
            ...prev,
            payload.new as ChatMessage,
          ]);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'Message',
          filter: `eventId=eq.${eventId}`,
        },
        (payload) => {
          console.log('UPDATE payload:', payload);
          setMessages((prev) =>
            prev.map((message) =>
              message.id === payload.new.id
                ? { ...message, ...payload.new }
                : message
            )
          );
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'Message',
          filter: `eventId=eq.${eventId}`,
        },
        (payload) => {
          console.log('DELETE payload:', payload);
          setMessages((prev) =>
            prev.filter((message) => message.id !== payload.old.id)
          );
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });

    return () => {
      console.log('Cleaning up subscription');
      supabase.removeChannel(messageChannel);
    };
  }, [eventId]);

  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('Message')
        .select('*')
        .eq('eventId', eventId)
        .order('createdAt', { ascending: true });

      console.log(data, error);

      if (error) {
        console.error('Detailed Error:', error);
        toast.error(`Failed to load messages: ${error.message}`);
        return;
      }
      setMessages(data as unknown as ChatMessage[]);
    } catch (error) {
      console.error('Catch Block Error:', error);
      toast.error('Unexpected error loading messages');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchChatSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('ChatSettings')
        .select('*')
        .eq('eventId', eventId)
        .single();

      console.log(data);

      if (error) throw error;
      setSettings(data as ChatSettings);
    } catch (error) {
      console.error('Error fetching chat settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (content: string) => {
    console.log({ content });

    if (!settings?.isEnabled) {
      toast.error('Chat is currently disabled');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('Message')
        .insert([
          {
            content,
            eventId,
            userId,
            id: crypto.randomUUID(),
            publicId: createId(),
            createdAt: new Date().toISOString(),
            isPinned: false,
            status: 'SENT',
          },
        ])
        .select(
          `
          *,
          user:userId (
            id,
            username,
            avatarUrl,
            name
          )
        `
        )
        .single();

      console.log('message:', data);

      if (error) throw error;

      console.log({ data });

      return data;
    } catch (error) {
      toast.error('Failed to send message');
      console.error('Error sending message:', error);
      throw error;
    }
  };

  const deleteMessage = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('Message')
        .delete()
        .eq('publicId', messageId)
        .eq('userId', userId);

      if (error) throw error;
      toast.success('Message deleted');
    } catch (error) {
      toast.error('Failed to delete message');
      console.error('Error deleting message:', error);
    }
  };

  const pinMessage = async (messageId: string, isPinned: boolean) => {
    try {
      const { error } = await supabase
        .from('Message')
        .update({ isPinned })
        .eq('publicId', messageId);

      if (error) throw error;
      toast.success(isPinned ? 'Message pinned' : 'Message unpinned');
    } catch (error) {
      toast.error('Failed to update message');
      console.error('Error updating message:', error);
    }
  };

  const addReaction = async (messageId: string, emoji: string) => {
    try {
      const { error } = await supabase
        .from('MessageReaction')
        .insert([
          {
            id: crypto.randomUUID(), // Add id field
            publicId: createId(),
            messageId,
            userId,
            emoji,
            createdAt: new Date().toISOString(),
          },
        ]);

      if (error) throw error;
    } catch (error) {
      toast.error('Failed to add reaction');
      console.error('Error adding reaction:', error);
    }
  };

  const removeReaction = async (reactionId: string) => {
    try {
      const { error } = await supabase
        .from('MessageReaction')
        .delete()
        .eq('id', reactionId)
        .eq('userId', userId);

      if (error) throw error;
    } catch (error) {
      toast.error('Failed to remove reaction');
      console.error('Error removing reaction:', error);
    }
  };

  return {
    messages,
    settings,
    isLoading,
    sendMessage,
    deleteMessage,
    pinMessage,
    addReaction,
    removeReaction,
  };
};
