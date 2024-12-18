"use server";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateUserPrivacy(isPrivateProfile: boolean) {
  const session = await getSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  try {
    await prisma.user.update({
      where: { id: session.userId },
      data: {
        // Add this field to your Prisma User model
        isPrivateProfile,
      },
    });

    // Revalidate the profile page
    revalidatePath(`/profile/${session.user.username}`);

    return { success: true };
  } catch (error) {
    console.error("Privacy settings update error:", error);
    throw error;
  }
}

export async function manageFollowRequest(
  requestId: string,
  action: "accept" | "decline",
) {
  const session = await getSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  try {
    // Find the follow request
    const followRequest = await prisma.followRequest.findUnique({
      where: { id: requestId },
      select: { targetUserId: true, requestorId: true },
    });

    if (!followRequest) {
      throw new Error("Follow request not found");
    }

    // Ensure the current user is the target of the request
    if (followRequest.targetUserId !== session.userId) {
      throw new Error("Unauthorized to manage this request");
    }

    if (action === "accept") {
      // Create a follow relationship
      await prisma.follow.create({
        data: {
          followerId: followRequest.requestorId,
          followingId: followRequest.targetUserId,
        },
      });
    }

    // Delete the follow request
    await prisma.followRequest.delete({
      where: { id: requestId },
    });

    return { success: true, action };
  } catch (error) {
    console.error("Error managing follow request:", error);
    throw new Error(`Failed to ${action} follow request`);
  }
}

export async function sendFollowRequest(targetUserId: string) {
  const session = await getSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  try {
    // Check if target user allows followers and has a private profile
    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
    });

    if (!targetUser?.allowFollowers || !targetUser?.isPrivateProfile) {
      throw new Error("Cannot send follow request");
    }

    // Check if a request already exists
    const existingRequest = await prisma.followRequest.findUnique({
      where: {
        requestorId_targetUserId: {
          requestorId: session.userId,
          targetUserId: targetUserId,
        },
      },
    });

    if (existingRequest) {
      throw new Error("Follow request already sent");
    }

    // Create follow request
    await prisma.followRequest.create({
      data: {
        requestorId: session.userId,
        targetUserId: targetUserId,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Send follow request error:", error);
    throw error;
  }
}
