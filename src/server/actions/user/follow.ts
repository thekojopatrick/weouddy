"use server";

import { FollowRequest } from "./types";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

interface FollowResult {
  success: boolean;
  isFollowing?: boolean;
}

export async function toggleFollow(
  targetUserId: string,
): Promise<FollowResult> {
  const session = await getSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  try {
    // Check if the user is already following
    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: session.userId,
          followingId: targetUserId,
        },
      },
    });

    if (existingFollow) {
      // Unfollow
      await prisma.follow.delete({
        where: {
          followerId_followingId: {
            followerId: session.userId,
            followingId: targetUserId,
          },
        },
      });
    } else {
      // Follow
      await prisma.follow.create({
        data: {
          followerId: session.userId,
          followingId: targetUserId,
        },
      });
    }

    // Revalidate the profile page to update stats
    revalidatePath(`/${session.user.username}`);

    return {
      success: true,
      isFollowing: !existingFollow,
    };
  } catch (error) {
    console.error("Error toggling follow:", error);
    throw new Error("Failed to toggle follow");
  }
}

export async function updateFollowSettings(
  allowFollowers: boolean,
): Promise<{ success: boolean }> {
  const session = await getSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  try {
    await prisma.user.update({
      where: { id: session.userId },
      data: { allowFollowers },
    });

    return { success: true };
  } catch (error) {
    console.error("Error updating follow settings:", error);
    throw new Error("Failed to update follow settings");
  }
}

export async function fetchFollowRequests(
  userId: string,
): Promise<FollowRequest[]> {
  const requests = await prisma.followRequest.findMany({
    where: { targetUserId: userId },
    include: {
      requestor: {
        select: {
          id: true,
          name: true,
          username: true,
          avatarUrl: true,
        },
      },
    },
  });

  return requests as FollowRequest[];
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
