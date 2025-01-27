import { z } from 'zod';
import { db } from '@/server/db/prisma';

// Input validation schema
const JoinEventSchema = z.object({
  identifier: z.string(),
  userId: z.string(),
  pin: z.string().optional(),
});

// Custom error class for clear error handling
class JoinEventError extends Error {
  constructor(
    message: string,
    public code: string
  ) {
    super(message);
  }
}

// Utility functions
async function verifyPinCode(
  storedPinCode: string | null,
  providedPin: string
): Promise<boolean> {
  if (!storedPinCode) return false;
  return storedPinCode.trim() === providedPin.trim();
}

async function fetchEventWithDetails(identifier: string) {
  return db.event.findUnique({
    where: { id: identifier },
    include: {
      attendees: { where: { status: 'APPROVED' } },
    },
  });
}

// Main joinEvent function
export async function joinEvent(
  input: z.infer<typeof JoinEventSchema>
) {
  const { identifier, userId, pin } = JoinEventSchema.parse(input);

  // Fetch event details
  const event = await fetchEventWithDetails(identifier);
  if (!event)
    throw new JoinEventError('Event not found.', 'EVENT_NOT_FOUND');

  // Check if event is disabled
  if (event.isDisabled) {
    throw new JoinEventError(
      'This event is no longer available.',
      'EVENT_DISABLED'
    );
  }

  // Check for invite-only event
  if (event.requiresApproval && event.accessType === 'INVITE_ONLY') {
    throw new JoinEventError(
      'This event requires approval to join.',
      'REQUIRES_APPROVAL'
    );
  }

  // Validate PIN if required
  if (
    event.pinCode &&
    !(await verifyPinCode(event.pinCode, pin ?? ''))
  ) {
    throw new JoinEventError(
      'Invalid PIN provided for this event.',
      'INVALID_PIN'
    );
  }

  // Determine attendee status
  const status =
    event.hostId === userId
      ? 'JOINED'
      : event.requiresApproval
        ? 'PENDING'
        : 'APPROVED';

  // Use transaction to ensure consistency
  const attendee = await db.$transaction(async (tx) => {
    // Upsert attendee to avoid duplication
    const attendee = await tx.attendee.upsert({
      where: {
        userId_eventId: { userId, eventId: event.id },
      },
      create: {
        eventId: event.id,
        userId,
        status,
      },
      update: {
        status,
      },
    });

    if (status === 'APPROVED' || status === 'JOINED') {
      //Initial Joined
      //ACCESS GRANTED = APPROVED
      //ACCESS DENIED == DENIED
      //REQUEST PENDING == PENDING
    }
    await tx.eventActivity.create({
      data: {
        eventId: event.id,
        userId,
        type: 'JOIN',
      },
    });

    // Optionally update event details or count (if needed)
    return attendee;
  });

  return {
    success: true,
    status: attendee.status,
    event: {
      id: event.id,
      name: event.name,
      slug: event.slug,
      accessType: event.accessType,
    },
  };
}

//Check user event status
export async function checkAttendeeStatus(
  eventId: string,
  userId: string
) {
  const result = db.attendee.findUnique({
    where: {
      userId_eventId: {
        userId,
        eventId,
      },
    },
    select: {
      id: true,
      status: true,
      event: { select: { id: true, name: true, slug: true } },
    },
  });

  const data = await result;

  if (data?.status === 'APPROVED' || data?.status === 'JOINED') {
    return {
      ...data,
      status: 'JOINED',
    };
  } else if (
    data?.status === 'PENDING' ||
    data?.status === 'DENIED'
  ) {
    return data;
  }

  return {
    id: eventId,
    status: 'NOT_JOINED',
  };
}
