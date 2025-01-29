"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Follow } from "@/server/actions/user/types";
import FollowButton from "./follow-button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { getUserFollowers } from "@/server/actions/user/queries";
import { toast } from "sonner";
import { toggleFollow } from "@/server/actions/user/follow";

interface UserFollowersProps {
  userId: string;
}

export function UserFollowers({ userId }: UserFollowersProps) {
  const [followers, setFollowers] = useState<Follow[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadFollowers = async () => {
      setIsLoading(true);
      try {
        const newFollowers = await getUserFollowers(userId);

        if (newFollowers.length === 0) {
          setHasMore(false);
        } else {
          setFollowers((prev) =>
            page === 1 ? newFollowers : [...prev, ...newFollowers],
          );
        }
      } catch (error) {
        console.error("Failed to load followers", error);
        toast.error("Failed to load followers");
      } finally {
        setIsLoading(false);
      }
    };

    loadFollowers();
  }, [userId, page]);

  const handleFollowToggle = async (targetUserId: string) => {
    try {
      await toggleFollow(targetUserId);

      // Optimistically update the UI
      setFollowers((prev) =>
        prev.map((follower) =>
          follower.follower.id === targetUserId
            ? { ...follower, isFollowing: !follower.isFollowing }
            : follower,
        ),
      );
    } catch (error) {
      toast.error("Failed to toggle follow");
      console.error(error);
    }
  };

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  const filteredFollowers = followers.filter(
    (f) =>
      f.follower.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.follower.username.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (filteredFollowers.length === 0 && !isLoading) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        No followers found
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <div className="mb-4">
        <Input
          placeholder="Search followers"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full shadow-none text-sm"
        />
      </div>

      <div className="grid gap-4 w-full">
        {filteredFollowers.map((follow) => {
          const { follower } = follow;
          return (
            <div
              key={follower.id}
              className="flex items-center justify-between p-4 border rounded-lg w-full"
            >
              <Link
                href={`/${follower.username}`}
                className="flex items-center space-x-3 grow"
              >
                <Avatar>
                  <AvatarImage src={follower.avatarUrl || "/placeholder.svg"} />
                  <AvatarFallback>{follower.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{follower.name}</p>
                  <p className="text-muted-foreground text-sm">
                    @{follower.username}
                  </p>
                </div>
              </Link>
              <FollowButton
                isFollowing={follow.isFollowing!}
                isMutual={follow.isMutual}
                onToggle={() => handleFollowToggle(follower.id)}
              />
            </div>
          );
        })}
      </div>
      {hasMore && (
        <div className="flex justify-center mt-6">
          <Button
            onClick={handleLoadMore}
            disabled={isLoading}
            variant={"ghost"}
          >
            {isLoading ? "Loading..." : "Load More Followers"}
          </Button>
        </div>
      )}
    </div>
  );
}
