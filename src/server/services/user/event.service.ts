import { db } from '@/server/db/prisma';

export class UserEventService {
  static async getBatchUserEventStatus(
    eventIds: string[],
    userId: string
  ) {
    const [memberships, pendingRequests] = await Promise.all([
      db.event.findMany({
        where: {
          id: { in: eventIds },
          members: {
            some: {
              id: userId,
            },
          },
        },
        select: { id: true },
      }),
      db.attendee.findMany({
        where: {
          eventId: { in: eventIds },
          userId,
          status: 'PENDING',
        },
        select: { eventId: true },
      }),
    ]);

    const membershipSet = new Set(memberships.map((m) => m.id));
    const pendingSet = new Set(pendingRequests.map((r) => r.eventId));

    return Object.fromEntries(
      eventIds.map((eventId) => [
        eventId,
        membershipSet.has(eventId)
          ? 'JOINED'
          : pendingSet.has(eventId)
            ? 'PENDING'
            : 'NOT_JOINED',
      ])
    );
  }
}
