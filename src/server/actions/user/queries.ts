'use server';

import {
  EventWithDetails,
  PostWithDetails,
} from '@/types/prisma.types';
import { Follow, UserProfile } from './types';

import { prisma } from '@/lib/prisma';

export async function getUserProfile(
  usernameOrId: string
): Promise<UserProfile | null> {
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ username: usernameOrId }, { id: usernameOrId }],
    },
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      avatarUrl: true,
      bio: true,
      allowFollowers: true,
      posts: true,
      joinedEvents: true,
      hostedEvents: true,
    },
  });

  if (!user) return null;

  return user;
}

export async function getFollowStats(usernameOrId: string) {
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ username: usernameOrId }, { id: usernameOrId }],
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

export async function getUserFollowers(
  usernameOrId: string
): Promise<Follow[]> {
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ username: usernameOrId }, { id: usernameOrId }],
    },
    select: { id: true },
  });

  if (!user) return [];

  const followers = await prisma.follow.findMany({
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

  // Check if the user follows back each follower
  const followersWithMutual = await Promise.all(
    followers.map(async (follow) => {
      const isFollowingBack = await prisma.follow.findFirst({
        where: {
          followerId: user.id,
          followingId: follow.follower.id,
        },
      });

      return {
        ...follow,
        isMutual: !!isFollowingBack,
      };
    })
  );

  return followersWithMutual as Follow[];
}

export async function getUserFollowing(
  usernameOrId: string
): Promise<Follow[]> {
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ username: usernameOrId }, { id: usernameOrId }],
    },
    select: { id: true },
  });

  if (!user) return [];

  const following = await prisma.follow.findMany({
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

  // Check if each followed user follows back
  const followingWithMutual = await Promise.all(
    following.map(async (follow) => {
      const isFollowedBack = await prisma.follow.findFirst({
        where: {
          followerId: follow.following.id,
          followingId: user.id,
        },
      });

      return {
        ...follow,
        isMutual: !!isFollowedBack,
      };
    })
  );

  return followingWithMutual as Follow[];
}

export async function checkIfFollowing(
  currentUserId: string,
  targetUsername: string
): Promise<boolean> {
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
  limit: number = 10
): Promise<EventWithDetails[]> {
  return prisma.event
    .findMany({
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
      orderBy: { dateTime: 'desc' },
      take: limit,
      skip: (page - 1) * limit,
    })
    .then((events) =>
      events.map((event) => ({
        ...event,
        memberCount: event._count.members,
        attendeeCount: event._count.attendees,
      }))
    ) as Promise<EventWithDetails[]>;
}

export async function fetchFollowers(
  userId: string,
  page: number = 1,
  limit: number = 20
): Promise<Follow[]> {
  return prisma.follow.findMany({
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
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: (page - 1) * limit,
  }) as Promise<Follow[]>;
}

export async function fetchUserPosts(
  userId: string,
  page: number = 1,
  limit: number = 10
): Promise<PostWithDetails[]> {
  return prisma.post.findMany({
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
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: (page - 1) * limit,
  }) as Promise<PostWithDetails[]>;
}

export async function fetchFollowing(
  userId: string,
  page: number = 1,
  limit: number = 20
): Promise<Follow[]> {
  return prisma.follow.findMany({
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
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: (page - 1) * limit,
  }) as Promise<Follow[]>;
}

export async function getUserEventStatus(
  eventId: string,
  userId: string
) {
  const [membership, pendingRequest] = await Promise.all([
    prisma.event.findFirst({
      where: {
        id: eventId,
        members: {
          some: {
            id: userId,
          },
        },
      },
    }),
    prisma.attendee.findFirst({
      where: {
        eventId,
        userId,
        status: 'PENDING',
      },
    }),
  ]);

  if (membership) return 'JOINED';
  if (pendingRequest) return 'PENDING';
  return 'NOT_JOINED';
}

export async function getProfileStats(usernameOrId: string) {
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ username: usernameOrId }, { id: usernameOrId }],
    },
    select: { id: true },
  });

  if (!user) return null;

  const [followStats, eventCount, postCount] = await Promise.all([
    getFollowStats(usernameOrId),
    prisma.event.count({
      where: {
        OR: [
          { hostId: user.id },
          { members: { some: { id: user.id } } },
        ],
      },
    }),
    prisma.post.count({
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
