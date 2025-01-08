
import { prisma } from '@/lib/prisma';
import type { ChatSettings } from '@/types/chat';

export async function sendMessage(
  eventId: string,
  userId: string,
  content: string
) {
  const message = await prisma.chatMessage.create({
    data: {
      eventId,
      userId,
      content,
    },
    include: {
      user: true,
    },
  });

  return message;
}

export async function pinMessage(messageId: string, isPinned: boolean) {
  return prisma.chatMessage.update({
    where: { id: messageId },
    data: { isPinned },
    include: {
      user: true,
    },
  });
}

// export async function hideMessage(messageId: string) {
//   return prisma.chatMessage.update({
//     where: { id: messageId },
//     data: { isHidden: true },
//   });
// }

export async function updateChatSettings(
  eventId: string,
  settings: Partial<ChatSettings>
) {
  return prisma.chatSettings.update({
    where: { eventId },
    data: settings,
  });
}