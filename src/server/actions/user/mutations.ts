import { prisma } from "@/lib/prisma";

export async function toggleFollowUser(
  followerId: string,
  followingId: string,
) {
  const existingFollow = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId,
        followingId,
      },
    },
  });

  if (existingFollow) {
    return prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });
  }

  return prisma.follow.create({
    data: {
      followerId,
      followingId,
    },
  });
}

export async function updateFollowPrivacy(
  userId: string,
  allowFollowers: boolean,
) {
  return prisma.user.update({
    where: { id: userId },
    data: { allowFollowers },
  });
}

export async function updateUserProfile(
  userId: string,
  data: {
    name?: string;
    email?: string;
  },
) {
  return prisma.user.update({
    where: { id: userId },
    data,
  });
}
