export * from "@/types/prisma.types";
export interface UserProfile {
  id: string;
  name: string | null;
  username: string | null;
  email?: string;
  avatarUrl: string | null;
  bio: string | null;
  allowFollowers: boolean;
}

export interface FollowStats {
  isFollowing?: boolean;
  followersCount: number;
  followingCount: number;
}
