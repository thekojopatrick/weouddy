import { FollowStats, UserProfile } from "./types";

import { prisma } from "@/lib/prisma";

export async function getUserProfile(userId: string): Promise<UserProfile> {
  const profile = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      avatarUrl: true,
      allowFollowers: true,
      _count: {
        select: {
          followers: true,
          following: true,
        },
      },
    },
  });

  if (!profile) throw new Error("User not found");
  return profile;
}

// export async function getUserProfile(userId: string) {
// 	return prisma.user.findUnique({
// 		where: { id: userId },
// 		select: {
// 			id: true,
// 			name: true,
// 			email: true,
// 			allowFollowers: true,
// 			hostedRooms: {
// 				select: {
// 					id: true,
// 					name: true,
// 					date: true,
// 					_count: {
// 						select: {
// 							members: true,
// 							posts: true,
// 						},
// 					},
// 				},
// 			},
// 			joinedRooms: {
// 				select: {
// 					id: true,
// 					name: true,
// 					date: true,
// 					_count: {
// 						select: {
// 							members: true,
// 							posts: true,
// 						},
// 					},
// 				},
// 			},
// 		},
// 	});
// }

export async function getUserFollowers(userId: string) {
  return prisma.follow.findMany({
    where: { followingId: userId },
    include: {
      follower: {
        select: {
          id: true,
          name: true,
          email: true,
          allowFollowers: true,
          _count: {
            select: {
              followers: true,
              following: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getUserFollowing(userId: string) {
  return prisma.follow.findMany({
    where: { followerId: userId },
    include: {
      following: {
        select: {
          id: true,
          name: true,
          email: true,
          _count: {
            select: {
              followers: true,
              following: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getFollowStats(
  userId: string,
  currentUserId?: string,
): Promise<FollowStats> {
  const [isFollowing, counts] = await Promise.all([
    currentUserId
      ? prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: currentUserId,
            followingId: userId,
          },
        },
      })
      : null,
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        _count: {
          select: {
            followers: true,
            following: true,
          },
        },
      },
    }),
  ]);

  return {
    isFollowing: !!isFollowing,
    followersCount: counts?._count.followers ?? 0,
    followingCount: counts?._count.following ?? 0,
  };
}
