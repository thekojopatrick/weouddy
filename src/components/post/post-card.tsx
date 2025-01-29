"use client";

import CaptionOnlyPostCard from "./caption-only-post-card";
import { EventPostWithMedia } from "./post-with-media-card";
import React from "react";

export interface EventPostCardProps {
  post: {
    id: string;
    caption?: string | null;
    media: Array<{
      id: string;
      url: string;
      type: "IMAGE" | "VIDEO";
    }>;
    createdAt: Date | string;
    userId: string;
    user: {
      name: string;
      avatarUrl?: string | null;
    };
    _count: {
      likes: number;
      comments: number;
    };
    likes?: Array<{ userId: string }>;
  };
  userId: string;
}

export function EventPostCard({ post, userId }: EventPostCardProps) {
  const hasMedia = post.media.length > 0;

  return hasMedia ? (
    <EventPostWithMedia post={post} userId={userId} />
  ) : (
    <CaptionOnlyPostCard post={post} userId={userId} />
  );
}
