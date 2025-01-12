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
          hostId: true,
          members: {
            where: { id: userId },
            select: { id: true },
          },
          attendees: {
            select: {
              userId: true,
              status: true,
            },
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

      // If user is already a member, return current status
      if (event.members.length > 0) {
        return {
          success: true,
          status: 'JOINED',
          event: {
            id: event.id,
            slug: event.slug!,
            accessType: event.accessType as never,
            requiresApproval: event.requiresApproval,
            attendees: event.attendees as never,
          },
        };
      }

      // Check PIN if required
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
        select: { id: true, status: true },
      });

      if (existingAttendee?.status === 'APPROVED') {
        if (event.members.length === 0) {
          await db.event.update({
            where: { id: event.id },
            data: {
              members: {
                connect: { id: userId },
              },
            },
          });
        }

        return {
          success: true,
          status: 'JOINED',
          event: {
            id: event.id,
            slug: event.slug!,
            accessType: event.accessType as never,
            requiresApproval: event.requiresApproval,
            attendees: event.attendees as never,
          },
        };
      }

      if (existingAttendee?.status === 'PENDING') {
        return {
          success: true,
          status: 'PENDING',
          event: {
            id: event.id,
            slug: event.slug!,
            accessType: event.accessType as never,
            requiresApproval: event.requiresApproval,
            attendees: event.attendees as never,
          },
        };
      }

      // Auto-approve if user is the creator or if approval is not required
      const status =
        event.hostId === userId || !event.requiresApproval
          ? 'APPROVED'
          : 'PENDING';

      await db.$transaction(async (tx) => {
        // Create or update attendee
        if (existingAttendee) {
          await tx.attendee.update({
            where: { id: existingAttendee.id },
            data: { status },
          });
        } else {
          await tx.attendee.create({
            data: {
              userId,
              eventId: event.id,
              status,
            },
          });
        }

        // Create activity record
        await tx.eventActivity.create({
          data: {
            eventId: event.id,
            userId,
            type: 'JOIN',
          },
        });

        // If approved, add as member
        if (status === 'APPROVED') {
          await tx.event.update({
            where: { id: event.id },
            data: {
              members: {
                connect: { id: userId },
              },
            },
          });
        }
      });

      // Fetch updated attendees list
      const updatedEvent = await db.event.findUnique({
        where: { id: event.id },
        select: {
          attendees: {
            select: {
              userId: true,
              status: true,
            },
          },
        },
      });

      return {
        success: true,
        status: status === 'PENDING' ? 'PENDING' : 'JOINED',
        event: {
          id: event.id,
          slug: event.slug!,
          accessType: event.accessType as never,
          requiresApproval: event.requiresApproval,
          attendees: (updatedEvent?.attendees as never) || [],
        },
      };
    } finally {
      this.releaseLock(userId, identifier);
    }
  }
}
