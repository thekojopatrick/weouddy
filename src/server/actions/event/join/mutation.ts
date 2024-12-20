"use server";

import { getEventById, getEventBySlug } from "../queries";

import { AccessType } from "@prisma/client";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const joinEventSchema = z.object({
  identifier: z.string(),
  identifierType: z.enum(["id", "slug"]),
  pinCode: z.string().optional(),
});

type JoinEventInput = z.infer<typeof joinEventSchema>;

export async function joinEvent(input: JoinEventInput) {
  try {
    const { identifier, identifierType, pinCode } = joinEventSchema.parse(
      input,
    );

    // Get current user from auth session
    const session = await getSession();
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    // Fetch event data using existing queries
    const event = identifierType === "id"
      ? await getEventById(identifier)
      : await getEventBySlug(identifier);

    if (!event) {
      throw new Error("Event not found");
    }

    // Check if user is already an attendee
    const existingAttendee = await prisma.attendee.findFirst({
      where: {
        userId: session.user.id,
        eventId: event.id,
      },
    });

    if (existingAttendee) {
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

    // Add user to event members
    await prisma.event.update({
      where: { id: event.id },
      data: {
        members: {
          connect: { id: session.user.id },
        },
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

// Helper function to determine if a string is a CUID
function isCUID(str: string): boolean {
  return /^c[a-zA-Z0-9]{24}$/.test(str);
}

// Function to get event data before joining
export async function getEventJoinInfo(identifier: string) {
  try {
    const identifierType = isCUID(identifier) ? "id" : "slug";
    const event = identifierType === "id"
      ? await getEventById(identifier)
      : await getEventBySlug(identifier);

    if (!event) {
      throw new Error("Event not found");
    }

    return {
      success: true,
      event: {
        id: event.id,
        name: event.name,
        description: event.description,
        accessType: event.accessType,
        requiresApproval: event.requiresApproval,
        host: {
          name: event.host.name,
          username: event.host.username,
          avatarUrl: event.host.avatarUrl,
        },
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch event",
    };
  }
}
