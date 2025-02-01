// types.ts
import { FollowRelation } from "@/server/services/user";
import { Post, Event, Attendee, User as PrismaUser } from "@prisma/client";

export interface UserProfile {
  id: string;
  name: string | null;
  username: string | null;
  email: string | null;
  avatarUrl: string | null;
  bio: string | null;
  allowFollowers: boolean;
  isPrivateProfile: boolean; // Added to match schema
  posts: Post[];
  hostedEvents: Event[];
  attendeeEvents: Attendee[];
}

export interface UserFollow {
  id: string;
  name: string | null; // Updated to allow null
  username: string | null; // Updated to allow null
  avatarUrl: string | null; // Updated to allow null
}

export interface Follow {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: Date;
  follower: UserFollow;
  following: UserFollow;
  isFollowing?: boolean;
  isMutual?: boolean;
}

export interface FollowStats {
  isFollowing?: boolean;
  isMutual?: boolean;
  followersCount: number;
  followingCount: number;
}

export interface ProfilePageData {
  id: string;
  name: string | null; // Updated to allow null
  username: string | null; // Updated to allow null
  avatarUrl: string | null; // Updated to allow null
  stats: {
    following: number;
    followers: number;
    events: number;
    posts: number;
  };
  isOwnProfile: boolean;
  isFollowing?: boolean;
  isMutual?: boolean;
  allowFollowers: boolean;
  isPrivateProfile: boolean; // Added to match schema
  followers: Array<UserFollow & FollowRelation>;
  following: Array<UserFollow & FollowRelation>;
}

export interface FollowButtonProps {
  isFollowing: boolean;
  isMutual?: boolean;
  onToggle: () => void;
  size?: "default" | "sm" | "lg" | "icon";
  disabled?: boolean;
}
