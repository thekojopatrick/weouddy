import { EventActivityType } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function trackEventActivity(
  eventId: string,
  userId: string,
  type: EventActivityType,
) {
  return prisma.eventActivity.create({
    data: { eventId, userId, type },
    include: { user: true },
  });
}

export async function getEventActivityStats(eventId: string) {
  const [activities, breakdown] = await Promise.all([
    prisma.eventActivity.findMany({
      where: { eventId },
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { user: true },
    }),
    prisma.eventActivity.groupBy({
      by: ["type"],
      where: { eventId },
      _count: true,
    }),
  ]);

  const activityBreakdown = breakdown.reduce(
    (acc, curr) => ({
      ...acc,
      [curr.type]: curr._count,
    }),
    {} as Record<string, number>,
  );

  return {
    totalActivities: activities.length,
    activityBreakdown,
    recentActivities: activities,
  };
}
