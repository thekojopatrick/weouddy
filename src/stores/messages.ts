import { create } from 'zustand';
import { supabase } from '@/utils/supabase/client';
import { toast } from 'sonner';
import { createId } from '@paralleldrive/cuid2';
import type { Message, MessageReaction, User } from '@prisma/client';
import React from 'react';

interface MessagesState {
  messages: (Message & { user: User })[];
  isLoading: boolean;
  users: Map<string, User>;

  // Store actions
  setMessages: (messages: (Message & { user: User })[]) => void;
  addMessage: (message: Message & { user: User }) => void;
  updateMessage: (message: Message & { user: User }) => void;
  deleteMessage: (messageId: string) => void;

  // API actions
  fetchMessages: (eventId: string) => Promise<void>;
  sendMessage: (
    content: string,
    eventId: string,
    userId: string
  ) => Promise<Message | null>;
  pinMessage: (messageId: string, isPinned: boolean) => Promise<void>;
  removeMessage: (messageId: string, userId: string) => Promise<void>;

  // Reaction handlers
  addReaction: (
    messageId: string,
    emoji: string,
    userId: string
  ) => Promise<void>;
  removeReaction: (
    reactionId: string,
    userId: string
  ) => Promise<void>;
}

export const useMessagesStore = create<MessagesState>((set, get) => ({
  messages: [],
  isLoading: true,
  users: new Map(),

  setMessages: (messages) => set({ messages }),

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
      users: state.users.set(message.user.id, message.user),
    })),

  updateMessage: (updatedMessage) =>
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.id === updatedMessage.id ? updatedMessage : msg
      ),
    })),

  deleteMessage: (messageId) =>
    set((state) => ({
      messages: state.messages.filter((msg) => msg.id !== messageId),
    })),

  fetchMessages: async (eventId) => {
    try {
      set({ isLoading: true });
      const { data, error } = await supabase
        .from('messages')
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
        .eq('eventId', eventId)
        .order('createdAt', { ascending: true });

      if (error) throw error;

      set({ messages: data, isLoading: false });
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
      set({ isLoading: false });
    }
  },

  sendMessage: async (content, eventId, userId) => {
    try {
      const messageData = {
        content,
        eventId,
        userId,
        id: crypto.randomUUID(),
        publicId: createId(),
        createdAt: new Date().toISOString(),
        isPinned: false,
        status: 'SENT',
      };

      const { data, error } = await supabase
        .from('messages')
        .insert([messageData])
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

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
      return null;
    }
  },

  pinMessage: async (messageId, isPinned) => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ isPinned })
        .eq('publicId', messageId);

      if (error) throw error;
      toast.success(isPinned ? 'Message pinned' : 'Message unpinned');
    } catch (error) {
      console.error('Error updating message:', error);
      toast.error('Failed to update message');
    }
  },

  removeMessage: async (messageId, userId) => {
    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('publicId', messageId)
        .eq('userId', userId);

      if (error) throw error;
      toast.success('Message deleted');
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error('Failed to delete message');
    }
  },

  addReaction: async (messageId, emoji, userId) => {
    try {
      const { error } = await supabase
        .from('message_reactions')
        .insert([
          {
            id: crypto.randomUUID(),
            publicId: createId(),
            messageId,
            userId,
            emoji,
            createdAt: new Date().toISOString(),
          },
        ]);

      if (error) throw error;
    } catch (error) {
      console.error('Error adding reaction:', error);
      toast.error('Failed to add reaction');
    }
  },

  removeReaction: async (reactionId, userId) => {
    try {
      const { error } = await supabase
        .from('message_reactions')
        .delete()
        .eq('id', reactionId)
        .eq('userId', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Error removing reaction:', error);
      toast.error('Failed to remove reaction');
    }
  },
}));

// Hook for real-time updates
export const useMessagesSubscription = (eventId: string) => {
  const { addMessage, updateMessage, deleteMessage } =
    useMessagesStore();

  React.useEffect(() => {
    const channel = supabase
      .channel(`messages-${eventId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `eventId=eq.${eventId}`,
        },
        (payload) => {
          console.log('New message:', payload);
          addMessage(payload.new);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `eventId=eq.${eventId}`,
        },
        (payload) => {
          console.log('Updated message:', payload);
          updateMessage(payload.new);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'messages',
          filter: `eventId=eq.${eventId}`,
        },
        (payload) => {
          console.log('Deleted message:', payload);
          deleteMessage(payload.old.id);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [eventId, addMessage, updateMessage, deleteMessage]);
};
