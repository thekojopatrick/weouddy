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

export interface UserFollow {
  id: string;
  name: string;
  username: string;
  avatarUrl: string;
}

export interface Follow {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: Date;
  follower: UserFollow;
  following: UserFollow;
  isFollowing?: boolean;
  isMutual?: boolean; // Added to track mutual follow status
}

export interface FollowStats {
  isFollowing?: boolean;
  isMutual?: boolean; // Added to track mutual follow status
  followersCount: number;
  followingCount: number;
}

export interface FollowRelation {
  isFollowing: boolean;
  isMutual: boolean;
}

export interface ProfilePageData {
  id: string;
  name: string;
  username: string;
  avatarUrl: string;
  stats: {
    following: number;
    followers: number;
    events: number;
    posts: number;
  };
  isOwnProfile: boolean;
  isFollowing?: boolean;
  isMutual?: boolean; // Added to track mutual follow status
  allowFollowers: boolean;
  followers: Array<UserFollow & FollowRelation>; // Enhanced with follow status
  following: Array<UserFollow & FollowRelation>; // Enhanced with follow status
}

export interface FollowButtonProps {
  isFollowing: boolean;
  isMutual?: boolean;
  onToggle: () => void;
  size?: "default" | "sm" | "lg" | "icon";
  disabled?: boolean;
}
