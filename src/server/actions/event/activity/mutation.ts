import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function joinEvent(eventId: string) {
  // Get the current authenticated user
  const session = await getSession();

  if (!session?.user) {
    throw new Error("User must be authenticated to join a event");
  }

  // Check if user is already a member to prevent duplicates
  const existingMembership = await prisma.event.findFirst({
    where: {
      id: eventId,
      members: {
        some: {
          id: session.userId,
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
        connect: { id: session.userId },
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
      userId: session.userId,
      type: "JOIN",
    },
  });

  return {
    message: "Joined event successfully",
    status: "joined",
    membersCount: updatedevent.members.length,
  };
}
