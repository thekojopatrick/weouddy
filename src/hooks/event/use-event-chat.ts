import { supabase } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { ChatMessage } from "@/types/chat";

export const useEventChat = (eventId: string, userId: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMessages();

    const channel = supabase
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

    return () => {
      supabase.removeChannel(channel);
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
          )
        `,
        )
        .eq("eventId", eventId)
        .order("createdAt", { ascending: true });

      if (error) throw error;
      setMessages(data as []);
    } catch (error) {
      toast.error("Failed to load chat messages");
      console.error("Error fetching messages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (content: string) => {
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

      console.log("message:", data);

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

  return {
    messages,
    isLoading,
    sendMessage,
    deleteMessage,
    pinMessage,
  };
};
