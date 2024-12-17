import {
  Attendee,
  Comment,
  Event,
  Like,
  Post,
  PostMedia,
  User,
} from "@prisma/client";

export type EventData = Event & {
  host: {
    name: string;
    avatarUrl: string;
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
  posts: PostData[];
  attendees: Attendee[];
  members: User[];
};
