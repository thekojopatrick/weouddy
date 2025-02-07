import { create } from 'zustand';
import { supabase } from '@/utils/supabase/client';
import { toast } from 'sonner';
import { createId } from '@paralleldrive/cuid2';
import type {
  Message,
  MessageReaction,
  MessageStatus,
  User,
} from '@prisma/client';
import React from 'react';

type MessageWithUser = Message & {
  user: {
    id: string;
    publicId: string;
    username: string | null;
    name: string | null;
    avatarUrl: string | null;
  } | null;
  createdAt: Date; // Changed from string to Date
};

interface MessagesState {
  messages: (Message & { user: User })[];
  isLoading: boolean;
  users: Map<string, User>;

  setMessages: (messages: MessageWithUser[]) => void;
  addMessage: (message: MessageWithUser) => void;
  updateMessage: (message: MessageWithUser) => void;
  deleteMessage: (messageId: string) => void;

  fetchMessages: (eventId: string) => Promise<void>;
  sendMessage: (
    content: string,
    eventId: string,
    userId: string
  ) => Promise<Message | null>;
  pinMessage: (messageId: string, isPinned: boolean) => Promise<void>;
  removeMessage: (messageId: string, userId: string) => Promise<void>;

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

  setMessages: (messages) =>
    set({
      messages: messages.map((msg) => ({
        ...msg,
        createdAt: new Date(msg.createdAt),
        user: msg.user, // Assuming user is returned as an array
      })),
      isLoading: false,
    }),

  addMessage: (message) =>
    set((state) => {
      const newMessage: Message = {
        ...message,
        createdAt: new Date(message.createdAt),
        user: message.user,
      };
      return {
        messages: [...state.messages, newMessage],
        users: state.users.set(newMessage.userId, newMessage.user),
      };
    }),

  updateMessage: (updatedMessage) =>
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.id === updatedMessage.id
          ? {
              ...updatedMessage,
              createdAt: new Date(updatedMessage.createdAt),
              user: updatedMessage.user[0],
            }
          : msg
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
            publicId,
            name,
            username,
            avatarUrl,
          )
        `
        )
        .eq('eventId', eventId)
        .order('createdAt', { ascending: true });

      if (error) throw error;

      set({
        messages: (data || [])
          .map((msg) => {
            if (!msg || typeof msg !== 'object') return null;
            return {
              id: String(msg.id),
              publicId: String(msg.publicId),
              content: String(msg.content),
              eventId: String(msg.eventId),
              userId: String(msg.userId),
              vendorId: msg.vendorId ? String(msg.vendorId) : null,
              isPinned: Boolean(msg.isPinned),
              status: msg.status as MessageStatus,
              createdAt: msg.createdAt
                ? new Date(msg.createdAt)
                : new Date(),
              user:
                msg.user && typeof msg.user === 'object'
                  ? msg.user
                  : null,
            };
          })
          .filter(
            (msg): msg is NonNullable<typeof msg> => msg !== null
          ),
        isLoading: false,
      });
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
        status: 'SENT' as const,
        vendorId: null,
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
      return data
        ? ({
            ...data,
            createdAt: new Date(data.createdAt),
            user: data.user || null,
          } as Message)
        : null;
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
        async (payload) => {
          const { data: messageWithUser } = await supabase
            .from('messages')
            .select(
              `
              *,
              user:userId (
                id,
                publicId,
                username,
                name,
                avatarUrl
              )
            `
            )
            .eq('id', payload.new.id)
            .single();

          if (messageWithUser) {
            const transformedMessage = {
              ...messageWithUser,
              createdAt: new Date(messageWithUser.createdAt),
              user: messageWithUser.user || null,
            } as unknown as MessageWithUser;
            addMessage(transformedMessage);
          }
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
        async (payload) => {
          const { data: messageWithUser } = await supabase
            .from('messages')
            .select(
              `
              *,
              user:userId (
                id,
                publicId,
                username,
                name,
                avatarUrl
              )
            `
            )
            .eq('id', payload.new.id)
            .single();

          if (messageWithUser) {
            const transformedMessage = {
              ...messageWithUser,
              createdAt: new Date(messageWithUser.createdAt),
              user: messageWithUser.user || null,
            } as unknown as MessageWithUser;
            updateMessage(transformedMessage);
          }
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
