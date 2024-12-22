'use client';

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { FollowRequests } from './follow-request';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UserFollowers } from './user-followers';
import { UserFollowing } from './user-following';
import { useState } from 'react';

interface FollowsDialogProps {
	userId: string;
	currentUserId?: string;
	followers?: Array<{
		follower: {
			id: string;
			name: string | null;
			email: string | null;
			_count: {
				followers: number;
				following: number;
			};
		};
	}>;
	following?: Array<{
		following: {
			id: string;
			name: string | null;
			email: string | null;
			_count: {
				followers: number;
				following: number;
			};
		};
	}>;
	stats: {
		following: number;
		followers: number;
		events: number;
		posts: number;
	};
}

export function FollowsDialog({ currentUserId, stats }: FollowsDialogProps) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<button className='text-sm text-muted-foreground hover:text-foreground transition-colors'>
					<span className='font-medium text-foreground'>{stats.followers}</span>{' '}
					Requests ·{' '}
					<span className='font-medium text-foreground'>{stats.followers}</span>{' '}
					Followers ·{' '}
					<span className='font-medium text-foreground'>{stats.following}</span>{' '}
					Following
				</button>
			</DialogTrigger>
			<DialogContent className='sm:max-w-[540px]'>
				<DialogHeader>
					<DialogTitle className='flex items-center gap-2'>People</DialogTitle>
				</DialogHeader>
				<Tabs defaultValue='followers' className='w-full'>
					<TabsList className='grid w-full grid-cols-3'>
						<TabsTrigger value='followers'>
							Followers ({stats.followers})
						</TabsTrigger>
						<TabsTrigger value='following'>
							Following ({stats.following})
						</TabsTrigger>
						<TabsTrigger value='requests'>
							Follow Request ({stats.followers})
						</TabsTrigger>
					</TabsList>
					<TabsContent value='followers'>
						<ScrollArea className='h-[400px] pr-4'>
							<UserFollowers userId={currentUserId!} />
						</ScrollArea>
					</TabsContent>
					<TabsContent value='following'>
						<ScrollArea className='h-[400px] pr-4'>
							<UserFollowing userId={currentUserId!} />
						</ScrollArea>
					</TabsContent>
					<TabsContent value='requests'>
						<ScrollArea className='h-[400px] pr-4'>
							<FollowRequests userId={currentUserId!} />
						</ScrollArea>
					</TabsContent>
				</Tabs>
			</DialogContent>
		</Dialog>
	);
}
