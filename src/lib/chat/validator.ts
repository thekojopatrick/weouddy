import { Prisma } from "@prisma/client";

export const chatMessageWithDetails =
  Prisma.validator<Prisma.ChatMessageDefaultArgs>()({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          username: true,
          avatarUrl: true,
        },
      },
      reactions: {
        include: {
          user: true,
        },
      },
    },
  });

export type ChatMessageWithDetails = Prisma.ChatMessageGetPayload<
  typeof chatMessageWithDetails
>;
