import { db } from "@/server/db/prisma";
import { UserProfile } from "./types";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { FollowService } from "./follow.service";

const updateProfileSchema = z.object({
  name: z.string().min(2),
  username: z.string().min(3),
  bio: z.string().max(500).optional(),
  avatarUrl: z.string().optional(),
});

export class ProfileService {
  static async getUserProfile(
    usernameOrId: string,
  ): Promise<UserProfile | null> {
    return db.user.findFirst({
      where: {
        OR: [{ username: usernameOrId }, { id: usernameOrId }],
      },
      select: {
        id: true,
        name: true,
        username: true,
        avatarUrl: true,
        bio: true,
        allowFollowers: true,
        isPrivateProfile: true,
      },
    });
  }

  static async updateProfile(
    userId: string,
    data: z.infer<typeof updateProfileSchema>,
  ) {
    const validatedData = updateProfileSchema.parse(data);

    const existingUser = await db.user.findUnique({
      where: { username: validatedData.username },
    });

    if (existingUser && existingUser.id !== userId) {
      throw new Error("Username is already taken");
    }

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: validatedData,
    });

    revalidatePath(`/${updatedUser.username}`);
    return updatedUser;
  }

  static async getProfileStats(usernameOrId: string) {
    const user = await this.getUserProfile(usernameOrId);
    if (!user) return null;

    const [followStats, eventCount, postCount] = await Promise.all([
      FollowService.getFollowStats(user.id),
      db.event.count({
        where: {
          OR: [{ hostId: user.id }, { members: { some: { id: user.id } } }],
        },
      }),
      db.post.count({
        where: { userId: user.id },
      }),
    ]);

    return {
      following: followStats?.followingCount ?? 0,
      followers: followStats?.followersCount ?? 0,
      events: eventCount,
      posts: postCount,
    };
  }
}
