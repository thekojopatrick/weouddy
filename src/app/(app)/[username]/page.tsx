import { ProfileHeader } from '@/components/profile/profile-header';
import { ProfileTabs } from '@/components/profile/profile-tabs';
import { getSession } from '@/lib/auth';
import {
  getUserProfile,
  getUserFollowers,
  getUserFollowing,
  getProfileStats,
  checkIfFollowing,
} from '@/server/actions/user/queries';
import { ProfilePageData } from '@/types/prisma.types';

import { redirect } from 'next/navigation';

interface ProfilePageProps {
  params: {
    username: string;
  };
}

export default async function ProfilePage({
  params,
}: ProfilePageProps) {
  const { username } = await params;

  const session = await getSession();

  if (!session) {
    redirect('/auth');
  }

  // Fetch profile data for the viewed profile
  const [
    viewedUserProfile,
    followers,
    following,
    stats,
    isFollowing,
  ] = await Promise.all([
    getUserProfile(username),
    getUserFollowers(username),
    getUserFollowing(username),
    getProfileStats(username), // Use the new function here
    checkIfFollowing(session.userId, username),
  ]);

  if (!viewedUserProfile) {
    redirect('/404');
  }

  const profile: ProfilePageData = {
    id: viewedUserProfile.id,
    name: viewedUserProfile.name ?? '',
    username: viewedUserProfile.username ?? '',
    avatarUrl:
      viewedUserProfile.avatarUrl ??
      session.user.user_metadata.avatar_url ??
      '/placeholder.svg',
    stats: stats ?? {
      // Use the fetched stats
      following: 0,
      followers: 0,
      events: 0,
      posts: 0,
    },
    isOwnProfile: username === session?.user.username,
    isFollowing: isFollowing,
    allowFollowers: viewedUserProfile.allowFollowers ?? true,
    followers: followers as never,
    following: following as never,
  };

  return (
    <div className="min-h-screen bg-background">
      <main>
        <ProfileHeader {...profile} />
        {profile.isOwnProfile ||
          (profile.isFollowing && (
            <div className="text-center text-muted-foreground p-4">
              This profile is private. Follow to view content.
            </div>
          ))}
        <ProfileTabs stats={profile.stats} userId={session.userId} />
      </main>
    </div>
  );
}
