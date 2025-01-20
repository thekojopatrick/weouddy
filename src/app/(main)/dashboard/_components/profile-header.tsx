'use client';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';

import { Button } from '@/components/ui/button';

import Link from 'next/link';
import { useState } from 'react';
import { FollowsDialog } from '@/components/profile/follows-dialog';
import { Plus } from 'lucide-react';
import InviteModal from './invite-modal';
import { getNameInitials } from '@/lib/utils';

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
}: ProfileHeaderProps) {
  const [inviteModalOpen, setInviteModalOpen] = useState(false);

  return (
    <div className="py-6 pb-0">
      <div className="flex flex-col items-center md:items-start md:flex-row md:gap-6">
        <Avatar className="w-24 h-24">
          <AvatarImage src={avatarUrl} />
          <AvatarFallback>{getNameInitials(name)}</AvatarFallback>
        </Avatar>

        <div className="mt-4 md:mt-0 flex-1">
          <div className="text-center md:text-left">
            <h1 className="text-black text-xl font-semibold tracking-tight">
              {name}
            </h1>
            <p className="text-muted-foreground">@{username}</p>
          </div>

          <div className="mt-2 flex justify-center md:justify-start gap-3 text-sm">
            <FollowsDialog
              userId={id}
              currentUserId={id}
              stats={{ ...stats, followers: stats.followers }}
            />
          </div>
        </div>

        <div className="mt-4 md:mt-0 flex gap-2">
          {isOwnProfile && (
            <>
              <Button variant="outline" className="shadow-none">
                <Link href={`/${username}/settings`}>
                  Edit Profile
                </Link>
              </Button>
              <>
                <InviteModal
                  open={inviteModalOpen}
                  onOpenChange={setInviteModalOpen}
                />

                {/* Update the Invite talents button */}
                <Button
                  variant="outline"
                  className="gap-2 shadow-none"
                  onClick={() => setInviteModalOpen(true)}
                >
                  <Plus size={16} />
                  Invite partners
                </Button>
              </>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
