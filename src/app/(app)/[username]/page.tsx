import { EmptyEvents } from '@/components/profile/empty-states';
import { ProfileHeader } from '@/components/profile/profile-header';
import { ProfileTabs } from '@/components/profile/profile-tabs';
import { getSession } from '@/lib/auth';

interface ProfilePageProps {
	params: {
		username: string;
	};
}

export default async function ProfilePage({ params }: ProfilePageProps) {
	const { username } = params;

	const session = await getSession();

	const profile = {
		name: session?.user.user_metadata.full_name,
		username: `${username}`,
		stats: {
			following: 0,
			followers: 0,
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
