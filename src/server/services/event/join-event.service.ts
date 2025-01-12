import { db } from '@/server/db/prisma';
import { z } from 'zod';
import { cache } from '@/lib/redis'; // Implement a caching solution like Redis or memory cache

const joinEventSchema = z.object({
  identifier: z.string().min(1),
  pin: z.string().optional(),
  userId: z.string().min(1),
});

interface JoinEventResponse {
  success: boolean;
  status: 'JOINED' | 'PENDING' | 'PENDING_APPROVAL';
  event?: {
    id: string;
    slug: string;
    accessType: 'LINK_ONLY' | 'PIN_REQUIRED';
    requiresApproval: boolean;
    attendees?: Array<{
      userId: string;
      status: 'PENDING' | 'APPROVED';
    }>;
  };
}

export class JoinEventError extends Error {
  constructor(
    message: string,
    public code: string
  ) {
    super(message);
    this.name = 'JoinEventError';
  }
}

export class JoinEventService {
  private static readonly LOCK_KEY_PREFIX = 'event-join-lock:';
  private static readonly EVENT_CACHE_PREFIX = 'event:';
  private static readonly LOCK_TIMEOUT = 5000;

  private static async getEventFromCache(identifier: string) {
    const cacheKey = `${this.EVENT_CACHE_PREFIX}${identifier}`;
    return cache.get(cacheKey);
  }

  private static async setEventCache(
    identifier: string,
    data: unknown
  ) {
    const cacheKey = `${this.EVENT_CACHE_PREFIX}${identifier}`;
    await cache.set(cacheKey, data, 60); // Cache for 1 minute
  }

  private static async acquireLock(
    userId: string,
    identifier: string
  ): Promise<boolean> {
    const lockKey = `${this.LOCK_KEY_PREFIX}${userId}-${identifier}`;
    return cache.set(lockKey, Date.now(), this.LOCK_TIMEOUT);
  }

  private static async releaseLock(
    userId: string,
    identifier: string
  ): Promise<void> {
    const lockKey = `${this.LOCK_KEY_PREFIX}${userId}-${identifier}`;
    await cache.del(lockKey);
  }

  static async joinEvent(input: unknown): Promise<JoinEventResponse> {
    const startTime = Date.now();
    const { identifier, pin, userId } = joinEventSchema.parse(input);

    // Use optimistic locking instead of pessimistic
    if (!(await this.acquireLock(userId, identifier))) {
      throw new JoinEventError(
        'A join request is already in progress',
        'LOCK_ERROR'
      );
    }

    try {
      // First, try to get event from cache
      let event = await this.getEventFromCache(identifier);

      if (!event) {
        // Optimize the query by selecting only needed fields
        event = await db.event.findFirst({
          where: {
            OR: [{ id: identifier }, { slug: identifier }],
          },
          select: {
            id: true,
            slug: true,
            requiresApproval: true,
            isDisabled: true,
            accessType: true,
            pinCode: true,
            hostId: true,
            _count: {
              select: {
                members: true,
              },
            },
          },
        });

        if (event) {
          await this.setEventCache(identifier, event);
        }
      }

      if (!event) {
        throw new JoinEventError('Event not found', 'NOT_FOUND');
      }

      if (event.isDisabled) {
        throw new JoinEventError(
          'Event is disabled',
          'EVENT_DISABLED'
        );
      }

      // PIN validation
      if (
        event.accessType === 'PIN_REQUIRED' &&
        pin !== event.pinCode
      ) {
        throw new JoinEventError(
          !pin ? 'PIN is required' : 'Invalid PIN',
          !pin ? 'PIN_REQUIRED' : 'INVALID_PIN'
        );
      }

      // Determine status without additional query

      const status =
        event.hostId === userId || !event.requiresApproval
          ? 'APPROVED'
          : 'PENDING';

      // Combine all database operations into a single transaction
      const result = await db.$transaction(async (tx) => {
        // First check for existing attendee
        const existingAttendee = await tx.attendee.findFirst({
          where: {
            AND: [{ userId: userId }, { eventId: event.id }],
          },
          select: {
            id: true,
            status: true,
          },
        });

        if (existingAttendee) {
          // Only update if status is different
          if (existingAttendee.status !== status) {
            return tx.attendee.update({
              where: { id: existingAttendee.id },
              data: { status },
              select: { status: true },
            });
          }
          return existingAttendee;
        }

        // Create attendee and activity in parallel if possible
        const [attendee] = await Promise.all([
          tx.attendee.create({
            data: {
              userId,
              eventId: event.id,
              status,
            },
            select: {
              status: true,
            },
          }),
          ,
          tx.eventActivity.create({
            data: {
              eventId: event.id,
              userId,
              type: 'JOIN',
            },
          }),
          ...(status === 'APPROVED'
            ? [
                tx.event.update({
                  where: { id: event.id },
                  data: {
                    members: {
                      connect: { id: userId },
                    },
                  },
                }),
              ]
            : []),
        ]);

        return attendee;
      });

      // Invalidate cache
      await cache.del(`${this.EVENT_CACHE_PREFIX}${identifier}`);

      const executionTime = Date.now() - startTime;
      console.log(`Join event execution time: ${executionTime}ms`);

      return {
        success: true,
        status: result.status === 'PENDING' ? 'PENDING' : 'JOINED',
        event: {
          id: event.id,
          slug: event.slug!,
          accessType: event.accessType as never,
          requiresApproval: event.requiresApproval,
        },
      };
    } finally {
      await this.releaseLock(userId, identifier);
    }
  }
}
