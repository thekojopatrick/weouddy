import {
	getFollowStats,
	getUserFollowers,
	getUserFollowing,
	getUserProfile,
} from '@/server/actions/user/queries';

import { EmptyEvents } from '@/components/profile/empty-states';
import { ProfileHeader } from '@/components/profile/profile-header';
import { ProfileTabs } from '@/components/profile/profile-tabs';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

interface ProfilePageProps {
	params: {
		username: string;
	};
}

export default async function ProfilePage({ params }: ProfilePageProps) {
	const { username } = params;

	const session = await getSession();

	if (!session) {
		redirect('/auth');
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [profileData, followers, following, stats] = await Promise.all([
		getUserProfile(session.userId),
		getUserFollowers(session.userId),
		getUserFollowing(session.userId),
		session ? getFollowStats(session.userId, session.userId) : null,
	]);

	const profile = {
		name: session?.user.user_metadata.full_name ?? profileData.name,
		username: `${username}`,
		avaterUrl: session?.user.user_metadata.avatar_url ?? profileData.avatarUrl,
		stats: {
			following: stats?.followingCount ?? 0,
			followers: stats?.followersCount ?? 0,
			events: 0,
			posts: 0,
			requests: 0,
		},
	};

	return (
		<div className='min-h-screen bg-background'>
			{/* <Header /> */}
			<main>
				<ProfileHeader
					name={profile.name}
					avatarUrl={profile.avaterUrl}
					username={profile.username}
					stats={profile.stats}
					isOwnProfile={params.username === session?.user.username}
				/>
				<ProfileTabs stats={profile.stats} />
				<EmptyEvents />
			</main>
		</div>
	);
}
