import { db } from '@/server/db/prisma';

export class UserEventService {
  static async getUserEventStatus(eventId: string, userId: string) {
    const [event, attendee] = await db.$transaction([
      db.event.findUnique({
        where: {
          id: eventId,
          hostId: userId, // Check if user is host
        },
      }),
      db.attendee.findFirst({
        where: {
          eventId,
          userId,
        },
      }),
    ]);

    if (event) return 'JOINED'; // Host is always joined
    if (attendee?.status === 'APPROVED') return 'JOINED';
    if (attendee?.status === 'PENDING') return 'PENDING';
    return 'NOT_JOINED';
  }

  static async getBatchUserEventStatus(
    eventIds: string[],
    userId: string
  ) {
    const [hostedEvents, attendees] = await db.$transaction([
      db.event.findMany({
        where: {
          id: { in: eventIds },
          hostId: userId, // Check hosted events
        },
        select: { id: true },
      }),
      db.attendee.findMany({
        where: {
          eventId: { in: eventIds },
          userId,
        },
        select: {
          eventId: true,
          status: true,
        },
      }),
    ]);

    const hostedSet = new Set(hostedEvents.map((e) => e.id));
    const attendeeMap = new Map(
      attendees.map((a) => [a.eventId, a.status])
    );

    return Object.fromEntries(
      eventIds.map((eventId) => [
        eventId,
        hostedSet.has(eventId)
          ? 'JOINED'
          : attendeeMap.get(eventId) === 'APPROVED'
            ? 'JOINED'
            : attendeeMap.get(eventId) === 'PENDING'
              ? 'PENDING'
              : 'NOT_JOINED',
      ])
    );
  }
}
