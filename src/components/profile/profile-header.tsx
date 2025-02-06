"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";
import { FollowsDialog } from "./follows-dialog";
import Link from "next/link";
import { toast } from "sonner";
import { toggleFollow } from "@/server/actions/user/follow";
import { useState } from "react";

interface ProfileHeaderProps {
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
  isOwnProfile?: boolean;
  isFollowing?: boolean;
  allowFollowers?: boolean;
}

export function ProfileHeader({
  id,
  name,
  avatarUrl,
  username,
  stats,
  isOwnProfile = false,
  isFollowing = false,
  allowFollowers = true,
}: ProfileHeaderProps) {
  const [following, setFollowing] = useState<boolean>(isFollowing);
  const [followersCount, setFollowersCount] = useState(stats.followers);

  const handleFollow = async () => {
    try {
      const result = await toggleFollow(id);
      setFollowing(result.isFollowing!);
      setFollowersCount((prev) => (result.isFollowing ? prev + 1 : prev - 1));

      toast.success(
        result.isFollowing
          ? "Followed successfully"
          : "Unfollowed successfully",
      );
    } catch (error) {
      toast.error("Failed to toggle follow");
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 pb-0">
      <div className="flex flex-col items-center md:items-start md:flex-row md:gap-6">
        <Avatar className="w-24 h-24">
          <AvatarImage src={avatarUrl ?? "/placeholder.svg"} />
          <AvatarFallback>{name[0]}</AvatarFallback>
        </Avatar>

        <div className="mt-4 md:mt-0 flex-1">
          <div className="text-center md:text-left">
            <h1 className="text-2xl font-bold tracking-tight">{name}</h1>
            <p className="text-muted-foreground">@{username}</p>
          </div>

          <div className="mt-2 flex justify-center md:justify-start gap-3 text-sm">
            <FollowsDialog
              userId={id}
              currentUserId={id}
              stats={{ ...stats, followers: followersCount }}
            />
          </div>
        </div>

        <div className="mt-4 md:mt-0 flex gap-2">
          {isOwnProfile ? (
            <Button variant="outline" className="shadow-none rounded-full">
              <Link href={`/${username}/settings`}>Edit Profile</Link>
            </Button>
          ) : allowFollowers ? (
            <Button
              onClick={handleFollow}
              variant={following ? "outline" : "default"}
              className="shadow-xs"
            >
              {following ? "Unfollow" : "Follow"}
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
