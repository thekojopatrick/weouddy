export interface UserProfile {
  id: string;
  name: string | null;
  email: string | null;
  avatarUrl: string | null;
  allowFollowers: boolean;
  _count: {
    followers: number;
    following: number;
  };
}

export interface FollowStats {
  isFollowing: boolean;
  followersCount: number;
  followingCount: number;
}
