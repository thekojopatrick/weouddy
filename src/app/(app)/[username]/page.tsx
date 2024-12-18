import {
	checkIfFollowing,
	getFollowStats,
	getUserProfile,
} from '@/server/actions/user/queries';

import { EmptyEvents } from '@/components/profile/empty-states';
import { ProfileHeader } from '@/components/profile/profile-header';
import { ProfilePageData } from '@/server/actions/user/types';
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

	// Fetch profile data for the viewed profile
	const [viewedUserProfile, stats, isFollowing] = await Promise.all([
		getUserProfile(username),
		//getUserFollowers(username),
		//getUserFollowing(username),
		getFollowStats(username),
		checkIfFollowing(session.userId, username),
	]);

	if (!viewedUserProfile) {
		redirect('/404');
	}

	const profile: ProfilePageData = {
		id: viewedUserProfile.id,
		name: viewedUserProfile.name ?? '',
		username: viewedUserProfile.username ?? '',
		avatarUrl: viewedUserProfile.avatarUrl ?? '/placeholder.svg',
		stats: {
			following: stats?.followingCount ?? 0,
			followers: stats?.followersCount ?? 0,
			events: 0,
			posts: 0,
		},
		isOwnProfile: username === session?.user.username,
		isFollowing: isFollowing,
		allowFollowers: viewedUserProfile.allowFollowers ?? true,
	};

	return (
		<div className='min-h-screen bg-background'>
			<main>
				<ProfileHeader {...profile} />
				<ProfileTabs stats={profile.stats} userId={profile.id} />
				{/* Conditionally render content based on profile type */}
				{profile.isOwnProfile || profile.isFollowing ? (
					<div>
						{/* Render events, posts, etc. */}
						<EmptyEvents />
					</div>
				) : (
					<div className='text-center text-muted-foreground p-4'>
						This profile is private. Follow to view content.
					</div>
				)}
			</main>
		</div>
	);
}
