"use server";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Validation schemas
const updateProfileSchema = z.object({
  name: z.string().min(2),
  username: z.string().min(3),
  bio: z.string().max(500).optional(),
  avatarUrl: z.string().optional(),
});

export async function updateProfile(
  userId: string,
  data: z.infer<typeof updateProfileSchema>,
) {
  const session = await getSession();

  if (!session || session.userId !== userId) {
    throw new Error("Unauthorized");
  }

  try {
    // Validate input
    const validatedData = updateProfileSchema.parse(data);

    // Check if username is unique
    const existingUser = await prisma.user.findUnique({
      where: {
        username: validatedData.username,
      },
    });

    if (existingUser && existingUser.id !== userId) {
      throw new Error("Username is already taken");
    }

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: validatedData.name,
        username: validatedData.username,
        bio: validatedData.bio,
        avatarUrl: validatedData.avatarUrl,
      },
    });

    // Revalidate the profile page
    revalidatePath(`/${updatedUser.username}`);

    return updatedUser;
  } catch (error) {
    console.error("Profile update error:", error);
    throw error;
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

    // Revalidate the profile page
    revalidatePath(`/profile/${session.user.username}`);

    return { success: true };
  } catch (error) {
    console.error("Follow settings update error:", error);
    throw error;
  }
}
