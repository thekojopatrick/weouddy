
import { prisma } from '@/server/db/prisma';
import type { ChatMessage, ChatSettings } from '@/types/chat';

export async function getRoomMessages(eventId: string, userId?: string): Promise<ChatMessage[]> {
  return prisma.chatMessage.findMany({
    where: {
      eventId,
      OR: [
        // { isHidden: false },
        { userId: userId },
      ],
    },
    include: {
      user: true,
    },
    orderBy: {
      createdAt: 'asc',
    },
  });
}

export async function getRoomChatSettings(eventId: string): Promise<ChatSettings> {
  const settings = await prisma.chatSettings.findUnique({
    where: { eventId },
  });

  if (!settings) {
    throw new Error('Chat settings not found');
  }

  return settings;
}

export async function getMessageById(messageId: string): Promise<ChatMessage | null> {
  return prisma.chatMessage.findUnique({
    where: { id: messageId },
    include: {
      user: true,
    },
  });
}