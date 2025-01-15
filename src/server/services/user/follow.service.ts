import { db } from '@/server/db/prisma';
import { FollowStats } from './types';

export class FollowService {
  static async getFollowStats(userId: string): Promise<FollowStats> {
    const [followingCount, followersCount] = await Promise.all([
      db.follow.count({
        where: { followerId: userId },
      }),
      db.follow.count({
        where: { followingId: userId },
      }),
    ]);

    return {
      followingCount,
      followersCount,
    };
  }

  static async toggleFollow(followerId: string, followingId: string) {
    const existingFollow = await db.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });

    if (existingFollow) {
      await db.follow.delete({
        where: {
          followerId_followingId: {
            followerId,
            followingId,
          },
        },
      });
      return { success: true, isFollowing: false };
    }

    await db.follow.create({
      data: {
        followerId,
        followingId,
      },
    });
    return { success: true, isFollowing: true };
  }

  static async checkIfFollowing(
    currentUserId: string,
    targetUsername: string
  ): Promise<boolean> {
    const targetUser = await db.user.findUnique({
      where: { username: targetUsername },
    });

    if (!targetUser) return false;

    const follow = await db.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: currentUserId,
          followingId: targetUser.id,
        },
      },
    });

    return !!follow;
  }
}
