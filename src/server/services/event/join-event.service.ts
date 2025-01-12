import { db } from '@/server/db/prisma';
import { z } from 'zod';

const joinEventSchema = z.object({
  identifier: z.string().min(1),
  pin: z.string().optional(),
  userId: z.string().min(1),
});

type JoinEventInput = z.infer<typeof joinEventSchema>;

interface JoinEventResponse {
  success: boolean;
  status: 'JOINED' | 'PENDING';
  event?: {
    id: string;
    slug: string;
    accessType: 'LINK_ONLY' | 'PIN_REQUIRED';
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
  private static readonly LOCK_TIMEOUT = 5000;
  private static locks = new Map<string, number>();

  private static validateInput(input: unknown): JoinEventInput {
    try {
      return joinEventSchema.parse(input);
    } catch (error) {
      throw new JoinEventError('Invalid input data', 'INVALID_INPUT');
    }
  }

  private static acquireLock(
    userId: string,
    identifier: string
  ): boolean {
    const lockKey = `${userId}-${identifier}`;
    const existingLock = this.locks.get(lockKey);

    if (
      existingLock &&
      Date.now() - existingLock < this.LOCK_TIMEOUT
    ) {
      return false;
    }

    this.locks.set(lockKey, Date.now());
    return true;
  }

  private static releaseLock(
    userId: string,
    identifier: string
  ): void {
    const lockKey = `${userId}-${identifier}`;
    this.locks.delete(lockKey);
  }

  static async joinEvent(input: unknown): Promise<JoinEventResponse> {
    const { identifier, pin, userId } = this.validateInput(input);

    if (!this.acquireLock(userId, identifier)) {
      throw new JoinEventError(
        'A join request is already in progress',
        'LOCK_ERROR'
      );
    }

    try {
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
          members: {
            where: { id: userId },
            select: { id: true },
          },
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

      if (event.members.length > 0) {
        return {
          success: true,
          status: 'JOINED',
          event: {
            id: event.id,
            slug: event.slug!,
            accessType: event.accessType as never,
            requiresApproval: event.requiresApproval,
          },
        };
      }

      if (event.accessType === 'PIN_REQUIRED') {
        if (!pin) {
          throw new JoinEventError('PIN is required', 'PIN_REQUIRED');
        }
        if (pin !== event.pinCode) {
          throw new JoinEventError('Invalid PIN', 'INVALID_PIN');
        }
      }

      const existingAttendee = await db.attendee.findFirst({
        where: {
          userId,
          eventId: event.id,
        },
        select: { status: true },
      });

      if (existingAttendee) {
        return {
          success: true,
          status:
            existingAttendee.status === 'APPROVED'
              ? 'JOINED'
              : 'PENDING',
          event: {
            id: event.id,
            slug: event.slug!,
            accessType: event.accessType as never,
            requiresApproval: event.requiresApproval,
          },
        };
      }

      const status = event.requiresApproval ? 'PENDING' : 'APPROVED';

      await db.$transaction([
        db.attendee.create({
          data: {
            userId,
            eventId: event.id,
            status,
          },
        }),
        db.eventActivity.create({
          data: {
            eventId: event.id,
            userId,
            type: 'JOIN',
          },
        }),
        ...(!event.requiresApproval
          ? [
              db.event.update({
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

      return {
        success: true,
        status: status === 'PENDING' ? 'PENDING' : 'JOINED',
        event: {
          id: event.id,
          slug: event.slug!,
          accessType: event.accessType as never,
          requiresApproval: event.requiresApproval,
        },
      };
    } finally {
      this.releaseLock(userId, identifier);
    }
  }
}
