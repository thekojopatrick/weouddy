import { ChatMessage } from '@/types/chat';
import { ChatMessageWithDetails } from './validator';

export function transformChatMessage(
  message: ChatMessageWithDetails,
  currentUserId: string
): ChatMessage {
  return {
    id: message.id,
    content: message.content,
    isPinned: message.isPinned,
    status: message.status.toLowerCase() as
      | 'sent'
      | 'delivered'
      | 'read',
    createdAt: message.createdAt.toISOString(),
    userId: message.userId,
    eventId: message.eventId,
    user: message.user,
    reactions: message.reactions
      ? Object.entries(
          message.reactions.reduce(
            (acc, reaction) => {
              if (!acc[reaction.emoji]) {
                acc[reaction.emoji] = {
                  count: 0,
                  reacted: false,
                  users: new Set(),
                };
              }
              acc[reaction.emoji].count++;
              acc[reaction.emoji].users.add(reaction.userId);
              if (reaction.userId === currentUserId) {
                acc[reaction.emoji].reacted = true;
              }
              return acc;
            },
            {} as Record<
              string,
              { count: number; reacted: boolean; users: Set<string> }
            >
          )
        ).map(([emoji, data]) => ({
          emoji,
          count: data.count,
          reacted: data.reacted,
        }))
      : undefined,
  };
}
