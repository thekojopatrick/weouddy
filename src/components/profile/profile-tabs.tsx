'use client';

import { CustomTabs, TabItem } from '@/components/ui/custom-tabs';

import { FollowRequests } from './follow-request';
import { UserEvents } from './user-events';
import { UserFollowers } from './user-followers';
import { UserFollowing } from './user-following';
import { UserPosts } from './user-posts';

interface ProfileTabsProps {
	stats: {
		following: number;
		followers: number;
		events: number;
		posts: number;
	};
	userId: string;
}

export function ProfileTabs({ stats, userId }: ProfileTabsProps) {
	const tabItems: TabItem[] = [
		{
			value: 'posts',
			label: `Posts ${stats.posts}`,
			content: <UserPosts userId={userId} />,
		},
		{
			value: 'events',
			label: `Events ${stats.events}`,
			content: <UserEvents userId={userId} />,
		},
		{
			value: 'requests',
			label: `Requests ${stats.events}`,
			content: <FollowRequests userId={userId} />,
		},
		{
			value: 'followers',
			label: `Followers ${stats.followers}`,
			content: <UserFollowers userId={userId} />,
		},
		{
			value: 'following',
			label: `Following ${stats.following}`,
			content: <UserFollowing userId={userId} />,
		},
	];

	return (
		<CustomTabs items={tabItems} variant='underline' defaultValue='posts' />
	);
}
