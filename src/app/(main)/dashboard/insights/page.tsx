import { getSession } from '@/lib/auth';
import OverviewDashboard from '../_components/overview-dashboard';
import { ProfilePageData } from '@/types/prisma.types';
import { redirect } from 'next/navigation';

export default async function InsightsPage() {
  const session = await getSession();

  if (!session) {
    redirect('/auth');
  }

  const profile: ProfilePageData = {
    id: session.userId,
    name: session?.user.name ?? '',
    username: session?.user.username ?? '',
    avatarUrl: session.user.user_metadata.avatar_url,
    stats: {
      // Use the fetched stats
      following: 0,
      followers: 0,
      events: 0,
      posts: 0,
    },
    isOwnProfile: session?.user.username,
    followers: [],
    following: [],
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <OverviewDashboard profile={profile} />
    </div>
  );
}
