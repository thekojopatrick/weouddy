import {
  Attendee,
  Comment,
  Event,
  Like,
  Post,
  PostMedia,
  User,
} from "@prisma/client";

import { PostWithDetails } from "./prisma.types";

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
};

export type EventWithFullData = Event & {
  host: User;
  posts: PostWithDetails[];
  attendees: Attendee[];
  members: User[];
};
