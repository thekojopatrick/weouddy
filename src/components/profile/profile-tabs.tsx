'use client';

import { CustomTabs, TabItem } from '@/components/ui/custom-tabs';

import { UserEvents } from './user-events';
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
			label: `ApproveRequest`,
			content: '',
		},
	];

	console.log({ userId });

	return (
		<CustomTabs items={tabItems} variant='underline' defaultValue='posts' />
	);
}
