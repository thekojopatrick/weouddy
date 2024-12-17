import { EmptyEvents } from '@/components/profile/empty-states';
import { ProfileHeader } from '@/components/profile/profile-header';
import { ProfileTabs } from '@/components/profile/profile-tabs';

interface ProfilePageProps {
	params: {
		username: string;
	};
}

export default function ProfilePage({ params }: ProfilePageProps) {
	// In a real app, you would fetch this data from your database
	const profile = {
		name: 'Kojo Patrick',
		username: '@kojopatrick',
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
					isOwnProfile={params.username === 'kojopatrick'}
				/>
				<ProfileTabs stats={profile.stats} />
				<EmptyEvents />
			</main>
		</div>
	);
}
