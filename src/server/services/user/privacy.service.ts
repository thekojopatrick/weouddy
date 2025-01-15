import { db } from '@/server/db/prisma';
import { revalidatePath } from 'next/cache';

export class PrivacyService {
  static async updatePrivacySettings(
    userId: string,
    settings: {
      isPrivateProfile?: boolean;
      allowFollowers?: boolean;
    }
  ) {
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: settings,
    });

    revalidatePath(`/${updatedUser.username}`);
    return { success: true };
  }

  static async sendFollowRequest(
    requestorId: string,
    targetUserId: string
  ) {
    const targetUser = await db.user.findUnique({
      where: { id: targetUserId },
    });

    if (
      !targetUser?.allowFollowers ||
      !targetUser?.isPrivateProfile
    ) {
      throw new Error('Cannot send follow request');
    }

    const existingRequest = await db.followRequest.findUnique({
      where: {
        requestorId_targetUserId: {
          requestorId,
          targetUserId,
        },
      },
    });

    if (existingRequest) {
      throw new Error('Follow request already sent');
    }

    await db.followRequest.create({
      data: {
        requestorId,
        targetUserId,
      },
    });

    return { success: true };
  }

  static async manageFollowRequest(
    requestId: string,
    targetUserId: string,
    action: 'accept' | 'decline'
  ) {
    const followRequest = await db.followRequest.findUnique({
      where: { id: requestId },
      select: { targetUserId: true, requestorId: true },
    });

    if (
      !followRequest ||
      followRequest.targetUserId !== targetUserId
    ) {
      throw new Error('Unauthorized to manage this request');
    }

    if (action === 'accept') {
      await db.follow.create({
        data: {
          followerId: followRequest.requestorId,
          followingId: followRequest.targetUserId,
        },
      });
    }

    await db.followRequest.delete({
      where: { id: requestId },
    });

    return { success: true, action };
  }
}
