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

export interface FollowRequestResult {
  success: boolean;
  action: "accept" | "decline";
}

export interface FollowRequest {
  id: string;
  requestorId: string;
  targetUserId: string;
  createdAt: Date;
  requestor: {
    id: string;
    name: string | null;
    username: string | null;
    avatarUrl: string | null;
  };
}
