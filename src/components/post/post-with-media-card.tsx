'use client';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import React, { useState } from 'react';
import {
  RiChat1Fill,
  RiChat1Line,
  RiHeart3Fill,
  RiHeart3Line,
} from '@remixicon/react';
import { cn, getNameInitials } from '@/lib/utils';

import { Badge } from '@/components/ui/badge';
import { Comments } from './comment-post-dialog';
import { EventPostCardProps } from './post-card';
import { PostMediaSlider } from '@/components/post/post-media-slider';
import { formatTimeAgo } from '@/lib/formatters';
import { usePostInteractions } from '@/hooks/use-post-interaction';

export function EventPostWithMedia({
  post,
  userId,
}: EventPostCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const {
    likes,
    commentCount,
    comments,
    isLiked,
    isCommentsOpen,
    setIsCommentsOpen,
    handleLike,
    handleComment,
    handleDeleteComment,
    currentUserId,
  } = usePostInteractions({
    postId: post.id,
    initialLikes: post._count.likes,
    initialComments: post._count.comments,
    currentUserId: userId,
    isLiked: post.likes?.some((like) => like.userId === userId),
  });

  const currentUserLiked =
    post.likes?.some((like) => like.userId === userId) || isLiked;

  return (
    <div
      className="relative group rounded-lg overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Badge
        variant="secondary"
        className="absolute left-4 top-4 z-10"
      >
        {post.userId === userId ? 'Your post' : 'Member'}
      </Badge>

      <PostMediaSlider
        media={post.media}
        alt={post.caption || ''}
        isHovered={isHovered}
      />

      <div
        className={cn(
          'absolute inset-0 bg-black/20 p-4 flex flex-col gap-2',
          isHovered || window.innerWidth < 768
            ? 'opacity-100'
            : 'opacity-0'
        )}
      >
        <div className="flex items-start gap-2 mt-auto">
          <Avatar className="h-8 w-8">
            <AvatarImage src={post.user.avatarUrl || undefined} />
            <AvatarFallback className="text-black text-xs">
              {getNameInitials(post.user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-white">
              {post.user.name}
            </span>
            <p className="text-xs text-gray-300">
              {formatTimeAgo(new Date(post.createdAt))}
            </p>
          </div>
        </div>

        {post.caption && (
          <p className="font-medium text-sm whitespace-pre-wrap text-gray-200">
            {post.caption}
          </p>
        )}

        <div className="flex items-center gap-4 text-white">
          <div className="flex items-center gap-1">
            <RiHeart3Fill className="size-4" />
            <span>{likes}</span>
          </div>
          <div className="flex items-center gap-1">
            <RiChat1Fill className="size-4" />
            <span>{commentCount}</span>
          </div>
        </div>

        <div className="absolute bottom-12 right-2 flex flex-col gap-2">
          <button
            onClick={handleLike}
            className={cn(
              'p-1 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors z-50',
              currentUserLiked && 'text-red-500'
            )}
          >
            {currentUserLiked ? (
              <RiHeart3Fill className="h-5 w-5" />
            ) : (
              <RiHeart3Line className="h-5 w-5" />
            )}
          </button>
          <button
            onClick={() => setIsCommentsOpen(true)}
            className="p-1 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors z-50"
          >
            <RiChat1Line className="size-5" />
          </button>
        </div>
      </div>

      <Comments
        postId={post.id}
        open={isCommentsOpen}
        onOpenChangeAction={setIsCommentsOpen}
        handleCommentAction={handleComment}
        handleDeleteCommentAction={handleDeleteComment}
        comments={comments}
        currentUserId={currentUserId}
      />
    </div>
  );
}
