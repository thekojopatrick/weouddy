'use client';

import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { EventPostCard } from '../event/post/post-card';
import { PostWithDetails } from '@/types/prisma.types';
import { fetchUserPosts } from '@/server/actions/user/queries';

interface UserPostsProps {
	userId: string;
}

export function UserPosts({ userId }: UserPostsProps) {
	const [posts, setPosts] = useState<PostWithDetails[]>([]);
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const [isLoading, setIsLoading] = useState(false);

	const loadPosts = async () => {
		setIsLoading(true);
		try {
			const newPosts = await fetchUserPosts(userId, page);

			if (newPosts.length === 0) {
				setHasMore(false);
			} else {
				setPosts((prev) => (page === 1 ? newPosts : [...prev, ...newPosts]));
			}
		} catch (error) {
			console.error('Failed to load posts', error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		loadPosts();
	}, [userId, page]);

	const handleLoadMore = () => {
		setPage((prev) => prev + 1);
	};

	if (posts.length === 0 && !isLoading) {
		return (
			<div className='text-center py-10 text-muted-foreground'>
				No posts yet
			</div>
		);
	}

	return (
		<div className='grid md:grid-cols-2 lg:grid-cols-3 gap-4 p-4'>
			{posts.map((post) => (
				<EventPostCard key={post.id} post={post as never} userId={userId} />
			))}

			{hasMore && (
				<div className='col-span-full flex justify-center mt-6'>
					<Button onClick={handleLoadMore} disabled={isLoading}>
						{isLoading ? 'Loading...' : 'Load More'}
					</Button>
				</div>
			)}
		</div>
	);
}
