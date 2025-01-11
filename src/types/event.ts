import {
  Comment,
  Event,
  Like,
  Post,
  PostMedia,
} from '@prisma/client';

import { EventWithDetails, PostWithDetails } from './prisma.types';

export type EventData = Event & {
  host: {
    name: string;
    avatarUrl: string;
  };
  _count: {
    members: number;
    posts: number;
  };
};

export type PostData = Post & {
  user: {
    name: string;
    avatarUrl: string;
  };
  comments: Comment[];
  likes: Like[];
  media: PostMedia[];
  _count: {
    likes: number;
    comments: number;
  };
};

export interface EventWithFullData {
  id: string;
  name: string;
  type: string;
  coverImage: string;
  host: {
    id: string;
    name: string;
    username: string | null;
    avatarUrl: string | null;
  };
  date: string;
  time: string;
  location: {
    name: string;
    city: string;
    country: string;
  };
  isPrivate: boolean;
  isDisabled: boolean;
  requiresApproval: boolean;
  accessType: 'LINK_ONLY' | 'PIN_REQUIRED';
  posts?: PostWithDetails[];
  members: number;
  description: string;
  additionalInfo?: string;
  slug: string | null;
  memberCount: number;
  attendeeCount: number;
  dateTime?: Date;
}

export interface JoinEventData {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  isDisabled: boolean;
  isPrivate: boolean; // This will determine the initial flow
  requiresApproval: boolean;
  accessType: 'LINK_ONLY' | 'PIN_REQUIRED';
  pinCode?: string;
}

export interface EventCache {
  events: EventWithDetails[];
  timestamp: number;
}

export type JoinStep =
  | 'LINK_PASTE'
  | 'QR_SCAN'
  | 'PIN_ENTRY'
  | 'WAITING_APPROVAL'
  | 'REDIRECTING';

export type UserEventStatus = 'NOT_JOINED' | 'PENDING' | 'JOINED';
