import { cache } from '@/lib/redis';
import { db } from '@/server/db/prisma';
import { z } from 'zod';
import { rateLimiter } from '../ratelimiter/rate-limiter.service';

const MAX_RETRIES = 3;
const RETRY_BASE_DELAY = 100; // ms

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
    accessType: 'DIRECT_PASS' | 'PIN_REQUIRED';
    requiresApproval: boolean;
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
  private static readonly EVENT_CACHE_PREFIX = 'event:';
  private static readonly LOCK_KEY_PREFIX = 'event-join-lock:';

  static async joinEvent(input: unknown): Promise<JoinEventResponse> {
    let attempt = 0;
    while (attempt < MAX_RETRIES) {
      try {
        return await this.attemptJoinEvent(input);
      } catch (error) {
        if (
          this.isRetryableError(error) &&
          attempt < MAX_RETRIES - 1
        ) {
          const delay = this.calculateBackoff(attempt);
          await new Promise((resolve) => setTimeout(resolve, delay));
          attempt++;
        } else {
          throw error;
        }
      }
    }
    throw new JoinEventError(
      'Failed to join event after maximum retries',
      'MAX_RETRIES_EXCEEDED'
    );
  }

  private static calculateBackoff(attempt: number): number {
    return (
      RETRY_BASE_DELAY * Math.pow(2, attempt) +
      Math.random() * RETRY_BASE_DELAY
    );
  }

  private static isRetryableError(error: unknown): boolean {
    const errorMessage = error instanceof Error ? error.message : '';
    return (
      errorMessage.includes('deadlock') ||
      errorMessage.includes('write conflict')
    );
  }

  private static async attemptJoinEvent(
    input: unknown
  ): Promise<JoinEventResponse> {
    const startTime = Date.now();
    const { identifier, pin, userId } = joinEventSchema.parse(input);

    // Rate limit join attempts
    await rateLimiter.limit({
      identifier: `join-event-${userId}`,
      limit: 3,
      window: 60000,
    });

    // Acquire distributed lock
    const lockKey = `${this.LOCK_KEY_PREFIX}${userId}-${identifier}`;
    const lockAcquired = await cache.set(
      lockKey,
      Date.now().toString()
    );

    if (!lockAcquired) {
      throw new JoinEventError(
        'A join request is already in progress',
        'CONCURRENT_JOIN_ATTEMPT'
      );
    }

    try {
      // Fetch event with optimized query
      const event = await db.event.findFirst({
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
        },
      });

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

      // Determine status
      const status =
        event.hostId === userId || !event.requiresApproval
          ? 'APPROVED'
          : 'PENDING';

      // Transactional join with conflict resolution
      const result = await db.$transaction(
        async (prisma) => {
          // Check for existing attendee with optimistic locking
          const existingAttendee = await prisma.attendee.findFirst({
            where: {
              userId: userId,
              eventId: event.id,
            },
            select: {
              id: true,
              status: true,
            },
          });

          if (existingAttendee) {
            // Update if status changed
            if (existingAttendee.status !== status) {
              return prisma.attendee.update({
                where: { id: existingAttendee.id },
                data: { status },
                select: { status: true },
              });
            }
            return { status: existingAttendee.status };
          }

          // Create new attendee
          const [attendee] = await Promise.all([
            prisma.attendee.create({
              data: {
                userId,
                eventId: event.id,
                status,
              },
              select: { status: true },
            }),
            status === 'APPROVED'
              ? prisma.event.update({
                  where: { id: event.id },
                  data: {
                    members: { connect: { id: userId } },
                  },
                })
              : Promise.resolve(),
            prisma.eventActivity.create({
              data: {
                eventId: event.id,
                userId,
                type: 'JOIN',
              },
            }),
          ]);

          return attendee;
        },
        {
          // Prisma transaction isolation for conflict handling
          isolationLevel: 'Serializable',
        }
      );

      const executionTime = Date.now() - startTime;
      console.log(`Join event execution time: ${executionTime}ms`);

      return {
        success: true,
        status: result.status === 'PENDING' ? 'PENDING' : 'JOINED',
        event: {
          id: event.id,
          slug: event.slug!,
          accessType: event.accessType as
            | 'DIRECT_PASS'
            | 'PIN_REQUIRED',
          requiresApproval: event.requiresApproval,
        },
      };
    } finally {
      // Always release lock
      await cache.del(lockKey);
    }
  }

  static async checkAttendeeStatus(eventId: string, userId: string) {
    return db.attendee.findUnique({
      where: {
        userId_eventId: {
          userId,
          eventId,
        },
      },
      select: { id: true, status: true },
    });
  }
}
