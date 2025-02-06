export interface UserProfile {
  id: string;
  name: string | null;
  username: string | null;
  email?: string;
  avatarUrl: string | null;
  bio: string | null;
  allowFollowers: boolean;
  isPrivateProfile?: boolean;
}

export interface FollowStats {
  isFollowing?: boolean;
  isMutual?: boolean;
  followersCount: number;
  followingCount: number;
}

export interface FollowRelation {
  isFollowing: boolean;
  isMutual: boolean;
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
