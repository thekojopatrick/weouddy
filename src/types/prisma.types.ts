import {
  AccessType,
  UserRole,
  MediaType,
  EventActivityType,
} from "@prisma/client";
import { User } from "@supabase/supabase-js";

export type CurrentUser = User & {
  id: string;
  username?: string | null;
  name?: string | null;
  avatarUrl?: string | null;
};

export interface BaseUser {
  id: string;
  email?: string | null;
  username?: string | null;
  name?: string | null;
  avatarUrl?: string | null;
  role: UserRole;
  isAnonymous: boolean;
  allowFollowers: boolean;
  isPrivateProfile: boolean; // Added to match schema
  lastActive: Date;
  createdAt: Date;
  updatedAt: Date;
  bio?: string | null;
  dob?: Date | null;
}

export interface UserProfile {
  id: string;
  name: string | null;
  username: string | null;
  email?: string | null;
  avatarUrl: string | null;
  bio: string | null;
  allowFollowers: boolean;
  isPrivateProfile: boolean; // Added to match schema
}

export interface FollowStats {
  isFollowing?: boolean;
  followersCount: number;
  followingCount: number;
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
}

export interface BaseEvent {
  id: string;
  name: string;
  type: string;
  description?: string | null;
  location?: string | null;
  dateTime: Date;
  qrCodeUrl?: string | null;
  coverImage?: string | null;
  slug?: string | null;
  pinCode?: string | null;
  vendorBudget?: number | null;
  vendorCosts?: any; // JSON type
  isPrivate: boolean;
  isDisabled: boolean;
  allowComments: boolean;
  allowLikes: boolean;
  allowChat: boolean;
  allowPosts: boolean;
  requiresApproval: boolean;
  accessType: AccessType;
  createdAt: Date;
  updatedAt: Date;
  hostId: string;
}

export interface EventWithDetails extends BaseEvent {
  host: {
    id: string;
    name: string | null;
    username: string | null;
    avatarUrl: string | null;
  };
  memberCount: number;
  attendeeCount: number;
}

export interface BasePost {
  id: string;
  publicId: string;
  caption?: string | null;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  eventId: string;
}

export interface PostWithDetails extends BasePost {
  media: PostMedia[];
  user: {
    name: string | null;
    username: string | null;
    avatarUrl: string | null;
  };
  _count: {
    likes: number;
    comments: number;
  };
}

export interface PostMedia {
  id: string;
  postId: string;
  url: string;
  type: MediaType;
  order: number;
  createdAt: Date;
}

// Comment-related Types
export interface BaseComment {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  postId: string;
}

// Like-related Types
export interface BaseLike {
  id: string;
  createdAt: Date;
  userId: string;
  postId: string;
}

// Event Activity Types
export interface EventActivity {
  id: string;
  eventId: string;
  userId: string;
  type: EventActivityType;
  createdAt: Date;
}

// Chat-related Types
export interface ChatMessage {
  id: string;
  content: string;
  isPinned: boolean;
  createdAt: Date;
  userId: string;
  eventId: string;
}

export interface ChatSettings {
  id: string;
  eventId: string;
  isEnabled: boolean;
  allowGuestMessages: boolean;
  slowMode: boolean;
  slowModeInterval: number;
  requireModeration: boolean;
  muteList?: string[];
  banList?: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Profile Page Types
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
  allowFollowers?: boolean;
  followers: UserFollow[];
  following: UserFollow[];
}
