export * from "@/types/prisma.types";
export interface UserProfile {
  id: string;
  name: string;
  username: string;
  email?: string;
  avatarUrl: string;
  bio: string;
  allowFollowers: boolean;
}

export interface FollowStats {
  isFollowing?: boolean;
  followersCount: number;
  followingCount: number;
}
