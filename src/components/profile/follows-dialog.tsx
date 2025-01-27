'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { FollowRequests } from './follow-request';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UserFollowers } from './user-followers';
import { UserFollowing } from './user-following';
import { useState } from 'react';
import { CustomTabs, TabItem } from '../ui/custom-tabs';

interface FollowsDialogProps {
  userId: string;
  currentUserId?: string;
  followers?: Array<{
    follower: {
      id: string;
      name: string | null;
      email: string | null;
      _count: {
        followers: number;
        following: number;
      };
    };
  }>;
  following?: Array<{
    following: {
      id: string;
      name: string | null;
      email: string | null;
      _count: {
        followers: number;
        following: number;
      };
    };
  }>;
  stats: {
    following: number;
    followers: number;
    events: number;
    posts: number;
  };
}

export function FollowsDialog({
  currentUserId,
  stats,
}: FollowsDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const tabItems: TabItem[] = [
    {
      value: 'followers',
      label: `Followers ${stats.followers}`,
      content: (
        <ScrollArea className="h-[400px]">
          <UserFollowers userId={currentUserId!} />
        </ScrollArea>
      ),
    },
    {
      value: 'following',
      label: `Following ${stats.following}`,
      content: (
        <ScrollArea className="h-[400px]">
          <UserFollowing userId={currentUserId!} />
        </ScrollArea>
      ),
    },
    {
      value: 'requests',
      label: `Requests`,
      content: (
        <ScrollArea className="h-[400px]">
          <FollowRequests userId={currentUserId!} />
        </ScrollArea>
      ),
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          <span className="font-medium text-foreground">{0}</span>{' '}
          Requests ·{' '}
          <span className="font-medium text-foreground">
            {stats.followers}
          </span>{' '}
          Followers ·{' '}
          <span className="font-medium text-foreground">
            {stats.following}
          </span>{' '}
          Following
        </button>
      </DialogTrigger>
      <DialogContent className="min-h-screen grid grid-rows-[auto,1fr] p-4 md:p-6 sm:max-w-[540px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            People
          </DialogTitle>
        </DialogHeader>
        <CustomTabs
          items={tabItems}
          variant="underline"
          defaultValue="followers"
          className="pt-0 px-0"
        />
      </DialogContent>
    </Dialog>
  );
}
