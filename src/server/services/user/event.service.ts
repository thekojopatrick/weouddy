import { db } from '@/server/db/prisma';

export class UserEventService {
  static async getUserEventStatus(eventId: string, userId: string) {
    const [membership, pendingRequest] = await db.$transaction([
      db.event.findFirst({
        where: {
          id: eventId,
          members: {
            some: {
              id: userId,
            },
          },
        },
      }),
      db.attendee.findFirst({
        where: {
          eventId,
          userId,
          status: 'PENDING',
        },
      }),
    ]);

    if (membership) return 'JOINED';
    if (pendingRequest) return 'PENDING';
    return 'NOT_JOINED';
  }

  static async getBatchUserEventStatus(
    eventIds: string[],
    userId: string
  ) {
    const [memberships, pendingRequests] = await db.$transaction([
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
