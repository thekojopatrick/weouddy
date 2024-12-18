"use server";

import { EventSettings } from "./types";
import { prisma } from "@/lib/prisma";

export async function toggleEventStatus(eventId: string, isDisabled: boolean) {
  return prisma.event.update({
    where: { id: eventId },
    data: {
      isDisabled,
    },
  });
}

export async function updateeventVisibility(
  eventId: string,
  isPrivate: boolean,
) {
  return prisma.event.update({
    where: { id: eventId },
    data: {
      isPrivate,
    },
  });
}

export async function updateEventInteractions(
  eventId: string,
  settings: Pick<EventSettings, "allowComments" | "allowLikes">,
) {
  return prisma.event.update({
    where: { id: eventId },
    data: { ...settings },
  });
}

export async function joinevent(eventId: string, userId: string) {
  // Check if user is already a member to prevent duplicates
  const existingMembership = await prisma.event.findFirst({
    where: {
      id: eventId,
      members: {
        some: {
          id: userId,
        },
      },
    },
  });

  if (existingMembership) {
    return { message: "Already a member", status: "existing" };
  }

  // Add user to event members
  const updatedevent = await prisma.event.update({
    where: { id: eventId },
    data: {
      members: {
        connect: { id: userId },
      },
    },
    include: {
      members: true,
    },
  });

  // Create a event activity record
  await prisma.eventActivity.create({
    data: {
      eventId: eventId,
      userId: userId,
      type: "JOIN",
    },
  });

  return {
    message: "Joined event successfully",
    status: "joined",
    membersCount: updatedevent.members.length,
  };
}
