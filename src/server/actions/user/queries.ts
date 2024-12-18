"use server";

import { prisma } from "@/lib/prisma";

export async function getUserProfile(
  usernameOrId: string,
) {
  return prisma.user.findFirst({
    where: {
      OR: [
        { username: usernameOrId },
        { id: usernameOrId },
      ],
    },
    select: {
      id: true,
      name: true,
      username: true,
      avatarUrl: true,
      bio: true,
      allowFollowers: true,
    },
  });
}

export async function getFollowStats(
  usernameOrId: string,
) {
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { username: usernameOrId },
        { id: usernameOrId },
      ],
    },
    select: { id: true },
  });

  if (!user) return null;

  return {
    followingCount: await prisma.follow.count({
      where: { followerId: user.id },
    }),
    followersCount: await prisma.follow.count({
      where: { followingId: user.id },
    }),
  };
}

export async function getUserFollowers(usernameOrId: string) {
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { username: usernameOrId },
        { id: usernameOrId },
      ],
    },
    select: { id: true },
  });

  if (!user) return [];

  return prisma.follow.findMany({
    where: { followingId: user.id },
    include: {
      follower: {
        select: {
          id: true,
          name: true,
          username: true,
          avatarUrl: true,
        },
      },
    },
  });
}

export async function getUserFollowing(usernameOrId: string) {
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { username: usernameOrId },
        { id: usernameOrId },
      ],
    },
    select: { id: true },
  });

  if (!user) return [];

  return prisma.follow.findMany({
    where: { followerId: user.id },
    include: {
      following: {
        select: {
          id: true,
          name: true,
          username: true,
          avatarUrl: true,
        },
      },
    },
  });
}

export async function checkIfFollowing(
  currentUserId: string,
  targetUsername: string,
) {
  const targetUser = await prisma.user.findUnique({
    where: { username: targetUsername },
  });

  if (!targetUser) return false;

  const follow = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId: currentUserId,
        followingId: targetUser.id,
      },
    },
  });

  return !!follow;
}

export async function fetchUserEvents(
  userId: string,
  page: number = 1,
  limit: number = 10,
) {
  const events = await prisma.event.findMany({
    where: {
      OR: [
        { hostId: userId }, // Events hosted by user
        { members: { some: { id: userId } } }, // Events user is a member of
      ],
    },
    include: {
      _count: {
        select: {
          members: true,
          attendees: true,
        },
      },
      host: {
        select: {
          name: true,
          username: true,
        },
      },
    },
    orderBy: { dateTime: "desc" },
    take: limit,
    skip: (page - 1) * limit,
  });

  return events;
}

export async function fetchFollowers(
  userId: string,
  page: number = 1,
  limit: number = 20,
) {
  const followers = await prisma.follow.findMany({
    where: { followingId: userId },
    include: {
      follower: {
        select: {
          id: true,
          name: true,
          username: true,
          avatarUrl: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: (page - 1) * limit,
  });

  return followers;
}

export async function fetchUserPosts(
  userId: string,
  page: number = 1,
  limit: number = 10,
) {
  const posts = await prisma.post.findMany({
    where: { userId },
    include: {
      media: true,
      user: {
        select: {
          name: true,
          username: true,
          avatarUrl: true,
        },
      },
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: (page - 1) * limit,
  });

  return posts;
}

export async function fetchFollowing(
  userId: string,
  page: number = 1,
  limit: number = 20,
) {
  "use server";

  const following = await prisma.follow.findMany({
    where: { followerId: userId },
    include: {
      following: {
        select: {
          id: true,
          name: true,
          username: true,
          avatarUrl: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: (page - 1) * limit,
  });

  return following;
}
