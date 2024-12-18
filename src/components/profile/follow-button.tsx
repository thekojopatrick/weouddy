'use client';

import { UserMinus, UserPlus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface FollowButtonProps {
	userId: string;
	initialIsFollowing: boolean;
	disabled?: boolean;
}

export function FollowButton({
	userId,
	initialIsFollowing,
	disabled,
}: FollowButtonProps) {
	const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
	const [isLoading, setIsLoading] = useState(false);
	const { toast } = useToast();

	const toggleFollow = async () => {
		setIsLoading(true);
		try {
			const response = await fetch(`/api/users/${userId}/follow`, {
				method: 'POST',
			});

			if (!response.ok) throw new Error('Failed to update follow status');

			setIsFollowing(!isFollowing);

			toast({
				title: isFollowing ? 'Unfollowed' : 'Following',
				description: isFollowing
					? 'You are no longer following this user'
					: 'You are now following this user',
			});
		} catch (error) {
			toast({
				title: 'Error',
				description: error.message,
				variant: 'destructive',
			});
		} finally {
			setIsLoading(false);
		}
	};

	if (disabled) return null;

	return (
		<Button
			variant={isFollowing ? 'outline' : 'default'}
			onClick={toggleFollow}
			disabled={isLoading}
			className='w-full sm:w-auto'
		>
			{isFollowing ? (
				<>
					<UserMinus className='mr-2 h-4 w-4' />
					Unfollow
				</>
			) : (
				<>
					<UserPlus className='mr-2 h-4 w-4' />
					Follow
				</>
			)}
		</Button>
	);
}
