"use server";

import { AccessType } from "@prisma/client";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Schema for validating join event inputs
const joinEventSchema = z.object({
  eventId: z.string(),
  pinCode: z.string().optional(),
});

type JoinEventInput = z.infer<typeof joinEventSchema>;

export async function joinEvent(input: JoinEventInput) {
  try {
    const { eventId, pinCode } = joinEventSchema.parse(input);

    // Get current user from auth session
    const session = await getSession();
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    // Fetch event data
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        attendees: {
          where: { userId: session.user.id },
        },
      },
    });

    if (!event) {
      throw new Error("Event not found");
    }

    // Check if user is already an attendee
    if (event.attendees.length > 0) {
      throw new Error("Already joined this event");
    }

    // Handle PIN validation for PIN_REQUIRED events
    if (event.accessType === AccessType.PIN_REQUIRED) {
      if (!pinCode) {
        throw new Error("PIN code is required");
      }
      if (event.pinCode !== pinCode) {
        throw new Error("Invalid PIN code");
      }
    }

    // Handle approval required events
    if (event.requiresApproval) {
      // Create a pending attendance request
      await prisma.attendee.create({
        data: {
          userId: session.user.id,
          eventId: event.id,
          status: "PENDING",
        },
      });

      // Log the join request activity
      await prisma.eventActivity.create({
        data: {
          eventId: event.id,
          userId: session.user.id,
          type: "JOIN",
        },
      });

      return { success: true, status: "PENDING_APPROVAL" };
    }

    // Direct join for events without approval requirement
    await prisma.attendee.create({
      data: {
        userId: session.user.id,
        eventId: event.id,
        status: "APPROVED",
      },
    });

    // Log the join activity
    await prisma.eventActivity.create({
      data: {
        eventId: event.id,
        userId: session.user.id,
        type: "JOIN",
      },
    });

    // Revalidate the event page
    revalidatePath(`/event/${event.slug}`);

    return { success: true, status: "JOINED", eventSlug: event.slug };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: "Invalid input data" };
    }
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Something went wrong" };
  }
}
