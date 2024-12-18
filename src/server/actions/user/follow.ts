"use server";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleFollow(targetUserId: string) {
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
    revalidatePath(`/profile/${session.user.username}`);

    return {
      success: true,
      isFollowing: !existingFollow,
    };
  } catch (error) {
    console.error("Error toggling follow:", error);
    throw new Error("Failed to toggle follow");
  }
}

export async function updateFollowSettings(allowFollowers: boolean) {
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
