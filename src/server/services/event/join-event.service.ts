import { db } from '@/server/db/prisma';

interface JoinEventParams {
  identifier: string;
  pin?: string;
  userId: string;
}

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

export class JoinEventService {
  private static readonly LOCK_TIMEOUT = 5000; // 5 seconds
  private static locks = new Map<string, number>();

  /**
   * The lock mechanism prevents race conditions where a user might trigger multiple join requests
   * simultaneously. This could happen when:
   * 1. User double-clicks the join button
   * 2. Network issues cause multiple retries
   * 3. User tries to join through different UI elements simultaneously
   *
   * The lock is user and event specific, meaning:
   * - Same user can't join same event multiple times simultaneously
   * - Same user can join different events simultaneously
   * - Different users can join same event simultaneously
   */
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

  static async joinEvent({
    identifier,
    pin,
    userId,
  }: JoinEventParams): Promise<JoinEventResponse> {
    // Try to acquire lock
    if (!this.acquireLock(userId, identifier)) {
      throw new Error('A join request is already in progress');
    }

    try {
      // Fetch event with minimal required fields
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
        },
      });

      if (!event) {
        throw new Error('Event not found');
      }

      if (event.isDisabled) {
        throw new Error('Event is disabled');
      }

      // Validate PIN if required
      if (event.accessType === 'PIN_REQUIRED') {
        if (!pin) throw new Error('PIN is required');
        if (pin !== event.pinCode) throw new Error('Invalid PIN');
      }

      // Check existing attendance
      const existingAttendee = await db.attendee.findFirst({
        where: {
          userId,
          eventId: event.id,
        },
        select: {
          status: true,
        },
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

      // Create new attendance and log activity in a transaction
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
      // Always release the lock, even if there's an error
      this.releaseLock(userId, identifier);
    }
  }
}
