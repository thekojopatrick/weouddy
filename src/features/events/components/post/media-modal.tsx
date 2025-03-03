"use client";
import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent } from "@/components/ui/dialog";
import { PostMediaSlider } from "./post-media-slider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatTimeAgo } from "@/lib/utils/formatters";
import { RiHeart3Fill, RiChat1Fill } from "@remixicon/react";
import { getNameInitials } from "@/lib/utils";

import { PostDataCard } from "./post-card";

interface MediaModalProps {
  isOpen: boolean;
  onOpenModal: (open: boolean) => void;
  post: PostDataCard;
  userId: string;
  onLike: () => void;
  onComment: () => void;
  isLiked: boolean;
  likes: number;
  commentCount: number;
}

export default function MediaModal({
  isOpen,
  onOpenModal,
  post,
  userId,
  onLike,
  onComment,
  isLiked,
  likes,
  commentCount,
}: MediaModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenModal}>
      <DialogContent
        closebtnstyle="grid place-items-center cursor-pointer left-4 bg-black text-white rounded-full size-8 text-center"
        className="max-w-4xl w-full h-screen md:h-auto p-0 gap-0 bg-black/90 overflow-clip"
      >
        <DialogTitle className="sr-only"> Media Post</DialogTitle>
        <div className="relative h-full flex flex-col justify-end md:flex-row">
          {/* Media Section */}
          <div className="h-fit md:flex-1 relative">
            <div className="aspect-auto">
              <PostMediaSlider
                media={post.media}
                alt={post.caption || ""}
                isHovered={true}
              />
            </div>
          </div>

          {/* Info Section */}
          <div className="w-full md:w-80 bg-black p-4 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={post.user.avatarUrl || undefined} />
                  <AvatarFallback className="text-black text-sm">
                    {getNameInitials(post.user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-white">
                    {post.user.name}
                  </span>
                  <span className="text-xs text-gray-400">
                    {formatTimeAgo(new Date(post.createdAt))}
                  </span>
                </div>
              </div>
              <Badge variant="secondary">
                {post.userId === userId ? "Your post" : "Member"}
              </Badge>
            </div>

            {post.caption && (
              <p className="text-sm text-gray-200 whitespace-pre-wrap">
                {post.caption}
              </p>
            )}

            <div className="mt-auto">
              <div className="flex items-center gap-6 text-white mb-4">
                <button
                  onClick={onLike}
                  className="flex items-center gap-2 hover:text-gray-300 transition-colors"
                >
                  <RiHeart3Fill
                    className={`h-6 w-6 ${isLiked ? "text-red-500" : ""}`}
                  />
                  <span>{likes}</span>
                </button>
                <button
                  onClick={onComment}
                  className="flex items-center gap-2 hover:text-gray-300 transition-colors"
                >
                  <RiChat1Fill className="h-6 w-6" />
                  <span>{commentCount}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
