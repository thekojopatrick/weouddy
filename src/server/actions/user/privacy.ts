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
    // You'll need to create a FollowRequest model in your Prisma schema
    const request = await prisma.followRequest.findUnique({
      where: {
        id: requestId,
        targetUserId: session.userId,
      },
    });

    if (!request) {
      throw new Error("Follow request not found");
    }

    if (action === "accept") {
      // Create a follow relationship
      await prisma.follow.create({
        data: {
          followerId: request.requestorId,
          followingId: session.userId,
        },
      });
    }

    // Remove the follow request
    await prisma.followRequest.delete({
      where: { id: requestId },
    });

    // Revalidate relevant paths
    revalidatePath(`/profile/${session.user.username}/followers`);

    return {
      success: true,
      action: action,
    };
  } catch (error) {
    console.error("Follow request management error:", error);
    throw error;
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
