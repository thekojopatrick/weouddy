export interface EventSettings {
  isPrivate: boolean;
  isDisabled: boolean;
  allowComments: boolean;
  allowLikes: boolean;
  allowPosts: boolean;
}

export interface EventStats {
  memberCount: number;
  postCount: number;
  activeMembers: number;
}

export interface EventMember {
  id: string;
  name: string | null;
  joinedAt: Date;
  isActive: boolean;
}

export interface Event {
  id: string;
  name: string;
  description: string | null;
  date: Date;
  isPrivate: boolean;
  settings: EventSettings;
  stats: EventStats;
  hostId: string;
  createdAt: Date;
  updatedAt: Date;
}
