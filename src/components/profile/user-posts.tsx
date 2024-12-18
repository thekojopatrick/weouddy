'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Heart, MessageCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { fetchUserPosts } from '@/server/actions/user/queries';

interface UserPostsProps {
	userId: string;
}

export function UserPosts({ userId }: UserPostsProps) {
	const [posts, setPosts] = useState([]);
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
				<Card key={post.id} className='overflow-hidden'>
					{post.media.length > 0 && (
						<div className='relative w-full aspect-square'>
							<Image
								src={post.media[0].url}
								alt='Post media'
								fill
								className='object-cover'
							/>
						</div>
					)}
					<CardContent className='p-4'>
						<div className='flex justify-between items-center'>
							<div className='flex items-center space-x-2'>
								<Heart className='w-5 h-5 text-red-500' />
								<span>{post._count.likes}</span>
								<MessageCircle className='w-5 h-5 ml-2' />
								<span>{post._count.comments}</span>
							</div>
							<p className='text-sm text-muted-foreground'>
								{new Date(post.createdAt).toLocaleDateString()}
							</p>
						</div>
						{post.caption && <p className='mt-2 text-sm'>{post.caption}</p>}
					</CardContent>
				</Card>
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
