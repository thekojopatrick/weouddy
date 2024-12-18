'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { UserEvents } from './user-events';
import { UserFollowers } from './user-followers';
import { UserFollowing } from './user-following';
import { UserPosts } from './user-posts';
import { useState } from 'react';

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
	const [activeTab, setActiveTab] = useState('posts');

	return (
		<Tabs
			defaultValue='posts'
			className='container mx-auto px-4 py-6'
			onValueChange={setActiveTab}
		>
			<TabsList className='grid w-full grid-cols-4'>
				<TabsTrigger value='posts'>
					Posts{' '}
					<span className='ml-2 text-muted-foreground'>{stats.posts}</span>
				</TabsTrigger>
				<TabsTrigger value='events'>
					Events{' '}
					<span className='ml-2 text-muted-foreground'>{stats.events}</span>
				</TabsTrigger>
				<TabsTrigger value='followers'>
					Followers{' '}
					<span className='ml-2 text-muted-foreground'>{stats.followers}</span>
				</TabsTrigger>
				<TabsTrigger value='following'>
					Following{' '}
					<span className='ml-2 text-muted-foreground'>{stats.following}</span>
				</TabsTrigger>
			</TabsList>
			<TabsContent value='posts'>
				<UserPosts userId={userId} />
			</TabsContent>
			<TabsContent value='events'>
				<UserEvents userId={userId} />
			</TabsContent>
			<TabsContent value='followers'>
				<UserFollowers userId={userId} />
			</TabsContent>
			<TabsContent value='following'>
				<UserFollowing userId={userId} />
			</TabsContent>
		</Tabs>
	);
}
