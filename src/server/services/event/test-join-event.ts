import { z } from "zod";
import { db } from "@/server/db/prisma";
import { EventActivityType } from "@prisma/client";

// Input validation schema
const JoinEventSchema = z.object({
  identifier: z.string(),
  userId: z.string(),
  pin: z.string().optional(),
});

class JoinEventError extends Error {
  constructor(
    message: string,
    public code: string,
  ) {
    super(message);
  }
}

async function verifyPinCode(
  storedPinCode: string | null,
  providedPin: string,
): Promise<boolean> {
  if (!storedPinCode) return false;
  return storedPinCode.trim() === providedPin.trim();
}

async function fetchEventWithDetails(identifier: string) {
  return db.event.findUnique({
    where: { id: identifier },
    include: {
      attendees: true,
    },
  });
}

async function createEventActivity(
  eventId: string,
  userId: string,
  type: EventActivityType,
) {
  return db.eventActivity.create({
    data: {
      eventId,
      userId,
      type,
    },
  });
}

export async function joinEvent(input: z.infer<typeof JoinEventSchema>) {
  const { identifier, userId, pin } = JoinEventSchema.parse(input);

  // Fetch event details
  const event = await fetchEventWithDetails(identifier);
  if (!event) throw new JoinEventError("Event not found.", "EVENT_NOT_FOUND");

  // Check if event is disabled
  if (event.isDisabled) {
    throw new JoinEventError(
      "This event is no longer available.",
      "EVENT_DISABLED",
    );
  }

  // If user is the host, grant immediate access without creating attendee record
  if (event.hostId === userId) {
    await createEventActivity(event.id, userId, "JOIN");
    return {
      success: true,
      status: "JOINED",
      event: {
        id: event.id,
        name: event.name,
        slug: event.slug,
        accessType: event.accessType,
      },
    };
  }

  // For invite-only events, create pending request
  if (event.accessType === "INVITE_ONLY") {
    const attendee = await db.$transaction(async (tx) => {
      const attendee = await tx.attendee.upsert({
        where: {
          userId_eventId: { userId, eventId: event.id },
        },
        create: {
          eventId: event.id,
          userId,
          status: "PENDING",
        },
        update: {
          status: "PENDING",
        },
      });

      await createEventActivity(event.id, userId, "RESQUEST_PENDING");
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

  // Validate PIN if required
  if (event.accessType === "PIN_REQUIRED") {
    if (!pin) {
      throw new JoinEventError(
        "PIN is required for this event.",
        "PIN_REQUIRED",
      );
    }
    if (!(await verifyPinCode(event.pinCode, pin))) {
      await createEventActivity(event.id, userId, "ACCESS_DENIED");
      throw new JoinEventError(
        "Invalid PIN provided for this event.",
        "INVALID_PIN",
      );
    }
  }

  // Determine initial status based on approval requirements
  const initialStatus = event.requiresApproval ? "PENDING" : "APPROVED";

  // Use transaction to ensure consistency
  const attendee = await db.$transaction(async (tx) => {
    // Check if user was previously denied
    const existingAttendee = await tx.attendee.findUnique({
      where: {
        userId_eventId: { userId, eventId: event.id },
      },
    });

    if (existingAttendee?.status === "DENIED") {
      await createEventActivity(event.id, userId, "ACCESS_DENIED");
      throw new JoinEventError(
        "Access to this event has been denied.",
        "ACCESS_DENIED",
      );
    }

    const attendee = await tx.attendee.upsert({
      where: {
        userId_eventId: { userId, eventId: event.id },
      },
      create: {
        eventId: event.id,
        userId,
        status: initialStatus,
      },
      update: {
        status: initialStatus,
      },
    });

    // Create appropriate activity log
    if (initialStatus === "APPROVED") {
      await createEventActivity(event.id, userId, "ACCESS_GRANTED");
      await createEventActivity(event.id, userId, "JOIN");
    } else {
      await createEventActivity(event.id, userId, "RESQUEST_PENDING");
    }

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

export async function checkAttendeeStatus(eventId: string, userId: string) {
  const event = await db.event.findUnique({
    where: { id: eventId ?? "" },
    select: { hostId: true },
  });

  // If user is the host, they automatically have access
  if (event?.hostId === userId) {
    return {
      id: eventId,
      status: "JOINED",
      event: { id: eventId },
    };
  }

  const attendee = await db.attendee.findUnique({
    where: {
      userId_eventId: {
        userId,
        eventId: eventId ?? "",
      },
    },
    select: {
      id: true,
      status: true,
      event: { select: { id: true, name: true, slug: true } },
    },
  });

  if (!attendee) {
    return {
      id: eventId,
      status: "NOT_JOINED",
    };
  }

  // Map APPROVED status to JOINED for consistency
  return {
    ...attendee,
    status: attendee.status === "APPROVED" ? "JOINED" : attendee.status,
  };
}
