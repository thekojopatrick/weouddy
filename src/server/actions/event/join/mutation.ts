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

// Cached event info lookup
const eventInfoCache = new Map();

export async function joinEvent(input: JoinEventInput) {
  try {
    const { identifier, identifierType, pinCode } =
      joinEventSchema.parse(input);

    // Parallel fetch of session and event data
    const [session, event] = await Promise.all([
      getSession(),
      identifierType === "id"
        ? getEventById(identifier)
        : getEventBySlug(identifier),
    ]);

    if (!session?.user?.id) throw new Error("Unauthorized");
    if (!event) throw new Error("Event not found");

    // Check existing membership status in a single query
    const [existingAttendee, isMember] = await Promise.all([
      prisma.attendee.findFirst({
        where: {
          userId: session.user.id,
          eventId: event.id,
        },
        select: { status: true },
      }),
      prisma.event.findFirst({
        where: {
          id: event.id,
          members: {
            some: { id: session.user.id },
          },
        },
        select: { id: true },
      }),
    ]);

    // Early returns for existing states
    if (existingAttendee?.status === "APPROVED" || isMember) {
      return {
        success: true,
        status: "JOINED",
        eventSlug: event.slug,
        message: "Welcome back to the event!",
      };
    }

    if (existingAttendee?.status === "PENDING") {
      return {
        success: true,
        status: "PENDING_APPROVAL",
        message: "Your join request is still pending approval",
      };
    }

    // PIN validation
    if (event.accessType === AccessType.PIN_REQUIRED) {
      if (!pinCode) throw new Error("PIN code is required");
      if (event.pinCode !== pinCode) throw new Error("Invalid PIN code");
    }

    // Handle approval flow
    if (event.requiresApproval) {
      await prisma.$transaction([
        prisma.attendee.create({
          data: {
            userId: session.user.id,
            eventId: event.id,
            status: "PENDING",
          },
        }),
        prisma.eventActivity.create({
          data: {
            eventId: event.id,
            userId: session.user.id,
            type: "JOIN",
          },
        }),
      ]);

      return {
        success: true,
        status: "PENDING_APPROVAL",
        message: "Your request to join has been sent",
      };
    }

    // Direct join flow with transaction
    await prisma.$transaction([
      prisma.attendee.create({
        data: {
          userId: session.user.id,
          eventId: event.id,
          status: "APPROVED",
        },
      }),
      prisma.event.update({
        where: { id: event.id },
        data: {
          members: {
            connect: { id: session.user.id },
          },
        },
      }),
      prisma.eventActivity.create({
        data: {
          eventId: event.id,
          userId: session.user.id,
          type: "JOIN",
        },
      }),
    ]);

    revalidatePath(`/events/${event.slug}`);

    return {
      success: true,
      status: "JOINED",
      eventSlug: event.slug,
      message: "Successfully joined the event",
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: "Invalid input data" };
    }
    if (error instanceof Error) return { success: false, error: error.message };
    return { success: false, error: "Something went wrong" };
  }
}

export async function getEventJoinInfo(identifier: string) {
  try {
    // Check cache first
    const cacheKey = `event-${identifier}`;
    if (eventInfoCache.has(cacheKey)) {
      return eventInfoCache.get(cacheKey);
    }

    const identifierType = /^c[a-zA-Z0-9]{24}$/.test(identifier)
      ? "id"
      : "slug";

    // Parallel fetch of session and event
    const [session, event] = await Promise.all([
      getSession(),
      identifierType === "id"
        ? getEventById(identifier)
        : getEventBySlug(identifier),
    ]);

    if (!event) throw new Error("Event not found");

    let userStatus: "NOT_JOINED" | "PENDING" | "JOINED" = "NOT_JOINED";

    if (session?.user?.id) {
      // Single query to check both member and attendee status
      const [memberStatus, attendeeStatus] = await Promise.all([
        prisma.event.findFirst({
          where: {
            id: event.id,
            members: { some: { id: session.user.id } },
          },
          select: { id: true },
        }),
        prisma.attendee.findFirst({
          where: {
            eventId: event.id,
            userId: session.user.id,
            status: "PENDING",
          },
          select: { id: true },
        }),
      ]);

      if (memberStatus) userStatus = "JOINED";
      else if (attendeeStatus) userStatus = "PENDING";
    }

    const result = {
      success: true,
      event: {
        id: event.id,
        name: event.name,
        description: event.description,
        accessType: event.accessType,
        requiresApproval: event.requiresApproval,
        slug: event.slug,
        isPrivate: event.isPrivate,
        host: {
          name: event.host.name,
          username: event.host.username,
          avatarUrl: event.host.avatarUrl,
        },
      },
      userStatus,
    };

    // Cache the result
    eventInfoCache.set(cacheKey, result);
    setTimeout(() => eventInfoCache.delete(cacheKey), 30000); // Cache for 30 seconds

    return result;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch event",
    };
  }
}
