import { prisma } from "@/lib/prisma";

export async function persisteventActivity(
  eventId: string,
  userId: string,
  activityType: "JOIN" | "LEAVE" | "POST" | "LIKE" | "COMMENT",
) {
  return prisma.eventActivity.create({
    data: {
      eventId,
      userId,
      type: activityType,
    },
  });
}
