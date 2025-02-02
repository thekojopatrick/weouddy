import { supabase } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { ChatMessage, ChatSettings } from "@/types/chat";

export const useEventChat = (eventId: string, userId: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [settings, setSettings] = useState<ChatSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
    fetchChatSettings();
    console.log("Start chat:");
    // Subscribe to chat messages
    const messageChannel = supabase
      .channel(`event-chat-${eventId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "ChatMessage",
          filter: `eventId=eq.${eventId}`,
        },
        (payload) => {
          console.log("Received payload:", payload);
          if (payload.eventType === "INSERT") {
            setMessages((prev) => [...prev, payload.new as ChatMessage]);
          } else if (payload.eventType === "DELETE") {
            setMessages((prev) =>
              prev.filter((message) => message.id !== payload.old.id),
            );
          } else if (payload.eventType === "UPDATE") {
            setMessages((prev) =>
              prev.map((message) =>
                message.id === payload.new.id
                  ? { ...message, ...payload.new }
                  : message,
              ),
            );
          }
        },
      )
      .subscribe();

    // Subscribe to chat settings changes
    const settingsChannel = supabase
      .channel(`chat-settings-${eventId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "ChatSettings",
          filter: `eventId=eq.${eventId}`,
        },
        (payload) => {
          if (payload.eventType === "UPDATE") {
            setSettings(payload.new as ChatSettings);
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messageChannel);
      supabase.removeChannel(settingsChannel);
    };
  }, [eventId]);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from("ChatMessage")
        .select(
          `
          *,
          user:userId (
            id,
            username,
            avatarUrl,
            name
          ),
          reactions:MessageReaction (
            id,
            emoji,
            userId
          )
        `,
        )
        .eq("eventId", eventId)
        .order("createdAt", { ascending: true });

      if (error) throw error;
      setMessages(data as unknown as ChatMessage[]);
    } catch (error) {
      toast.error("Failed to load chat messages");
      console.error("Error fetching messages:", error);
    }
  };

  const fetchChatSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("ChatSettings")
        .select("*")
        .eq("eventId", eventId)
        .single();

      if (error) throw error;
      setSettings(data as ChatSettings);
    } catch (error) {
      console.error("Error fetching chat settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (content: string) => {
    if (!settings?.isEnabled) {
      toast.error("Chat is currently disabled");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("ChatMessage")
        .insert([
          {
            content,
            eventId,
            userId,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            isPinned: false,
            status: "SENT",
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
        `,
        )
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      toast.error("Failed to send message");
      console.error("Error sending message:", error);
      throw error;
    }
  };

  const deleteMessage = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from("ChatMessage")
        .delete()
        .eq("id", messageId)
        .eq("userId", userId);

      if (error) throw error;
      toast.success("Message deleted");
    } catch (error) {
      toast.error("Failed to delete message");
      console.error("Error deleting message:", error);
    }
  };

  const pinMessage = async (messageId: string, isPinned: boolean) => {
    try {
      const { error } = await supabase
        .from("ChatMessage")
        .update({ isPinned })
        .eq("id", messageId);

      if (error) throw error;
      toast.success(isPinned ? "Message pinned" : "Message unpinned");
    } catch (error) {
      toast.error("Failed to update message");
      console.error("Error updating message:", error);
    }
  };

  const addReaction = async (messageId: string, emoji: string) => {
    try {
      const { error } = await supabase.from("MessageReaction").insert([
        {
          id: crypto.randomUUID(), // Add id field
          messageId,
          userId,
          emoji,
          createdAt: new Date().toISOString(),
        },
      ]);

      if (error) throw error;
    } catch (error) {
      toast.error("Failed to add reaction");
      console.error("Error adding reaction:", error);
    }
  };

  const removeReaction = async (reactionId: string) => {
    try {
      const { error } = await supabase
        .from("MessageReaction")
        .delete()
        .eq("id", reactionId)
        .eq("userId", userId);

      if (error) throw error;
    } catch (error) {
      toast.error("Failed to remove reaction");
      console.error("Error removing reaction:", error);
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
