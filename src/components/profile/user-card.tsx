'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';

import { FollowButton } from './follow-button';

interface UserCardProps {
	user: {
		id: string;
		name: string | null;
		email: string | null;
		_count: {
			followers: number;
			following: number;
		};
	};
	showFollowButton?: boolean;
	isFollowing?: boolean;
	currentUserId?: string;
}

export function UserCard({
	user,
	showFollowButton = true,
	isFollowing = false,
	currentUserId,
}: UserCardProps) {
	const isCurrentUser = currentUserId === user.id;

	return (
		<Card className='hover:bg-muted/50 transition-colors'>
			<CardContent className='p-4 flex items-center justify-between'>
				<div className='flex items-center space-x-4'>
					<Avatar>
						<AvatarImage src={`https://avatar.vercel.sh/${user.id}`} />
						<AvatarFallback>{user.name?.charAt(0) || 'U'}</AvatarFallback>
					</Avatar>
					<div>
						<p className='font-medium'>{user.name || 'Anonymous User'}</p>
						<p className='text-sm text-muted-foreground'>
							{user._count.followers} followers · {user._count.following}{' '}
							following
						</p>
					</div>
				</div>
				{showFollowButton && !isCurrentUser && (
					<FollowButton userId={user.id} initialIsFollowing={isFollowing} />
				)}
			</CardContent>
		</Card>
	);
}
