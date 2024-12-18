'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { fetchFollowing } from '@/server/actions/user/queries';
import { toast } from 'sonner';
import { toggleFollow } from '@/server/actions/user/follow';

interface UserFollowingProps {
	userId: string;
}

export function UserFollowing({ userId }: UserFollowingProps) {
	const [following, setFollowing] = useState([]);
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const [isLoading, setIsLoading] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');

	const loadFollowing = async () => {
		setIsLoading(true);
		try {
			const newFollowing = await fetchFollowing(userId, page);

			if (newFollowing.length === 0) {
				setHasMore(false);
			} else {
				setFollowing((prev) =>
					page === 1 ? newFollowing : [...prev, ...newFollowing]
				);
			}
		} catch (error) {
			console.error('Failed to load following', error);
			toast.error('Failed to load following');
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		loadFollowing();
	}, [userId, page]);

	const handleFollowToggle = async (targetUserId: string) => {
		try {
			await toggleFollow(targetUserId);

			// Optimistically update the UI
			setFollowing((prev) =>
				prev.map((follow) =>
					follow.following.id === targetUserId
						? { ...follow, isFollowing: !follow.isFollowing }
						: follow
				)
			);
		} catch (error) {
			toast.error('Failed to toggle follow');
		}
	};

	const handleLoadMore = () => {
		setPage((prev) => prev + 1);
	};

	const filteredFollowing = following.filter(
		(f) =>
			f.following.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			f.following.username.toLowerCase().includes(searchTerm.toLowerCase())
	);

	if (filteredFollowing.length === 0 && !isLoading) {
		return (
			<div className='text-center py-10 text-muted-foreground'>
				Not following anyone
			</div>
		);
	}

	return (
		<div className='container mx-auto px-4 py-6'>
			<div className='mb-4'>
				<Input
					placeholder='Search following'
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className='w-full'
				/>
			</div>

			<div className='grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
				{filteredFollowing.map((follow) => {
					const { following: user } = follow;
					return (
						<div
							key={user.id}
							className='flex items-center justify-between p-4 border rounded-lg'
						>
							<Link
								href={`/profile/${user.username}`}
								className='flex items-center space-x-3 flex-grow'
							>
								<Avatar>
									<AvatarImage src={user.avatarUrl || '/placeholder.svg'} />
									<AvatarFallback>{user.name[0]}</AvatarFallback>
								</Avatar>
								<div>
									<p className='font-medium'>{user.name}</p>
									<p className='text-muted-foreground text-sm'>
										@{user.username}
									</p>
								</div>
							</Link>
							<Button
								size='sm'
								variant='outline'
								onClick={() => handleFollowToggle(user.id)}
							>
								Unfollow
							</Button>
						</div>
					);
				})}
			</div>

			{hasMore && (
				<div className='flex justify-center mt-6'>
					<Button onClick={handleLoadMore} disabled={isLoading}>
						{isLoading ? 'Loading...' : 'Load More Following'}
					</Button>
				</div>
			)}
		</div>
	);
}
