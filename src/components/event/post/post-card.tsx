'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
	RiChat1Fill,
	RiChat1Line,
	RiHeart3Fill,
	RiHeart3Line,
} from '@remixicon/react';
import { cn, getNameInitials } from '@/lib/utils';

import { Badge } from '@/components/ui/badge';
import { Comments } from './comment-post-dialog';
import { PostMediaSlider } from '@/components/post-media-slider';
import { PostWithDetails } from '@/types/prisma.types';
import { formatTimeAgo } from '@/lib/formatters';
import { usePostInteractions } from '@/hooks/use-post-interaction';
import { useState } from 'react';

interface EventPostCardProps {
	post: PostWithDetails;
	userId: string;
}

export function EventPostCard({ post, userId }: EventPostCardProps) {
	const [isHovered, setIsHovered] = useState(false);

	const {
		likes,
		commentCount,
		comments,
		isLiked,
		isCommentsOpen,
		setIsCommentsOpen,
		handleLike,
		handleComment,
		handleDeleteComment,
		currentUserId,
	} = usePostInteractions({
		postId: post.id,
		initialLikes: post._count.likes,
		initialComments: post._count.comments,
		currentUserId: userId,
		isLiked: post.likes?.some((like) => like.userId === userId),
	});

	const currentUserLiked =
		post.likes?.some((like) => like.userId === userId) || isLiked;

	return (
		<div
			className='relative group'
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<div className='relative'>
				<Badge variant='secondary' className='absolute left-4 top-4 z-10'>
					{post.userId === userId ? 'Your post' : 'Member'}
				</Badge>

				<PostMediaSlider
					media={post.media}
					alt={post.caption || ''}
					isHovered={isHovered}
				/>
			</div>

			<div
				className={cn(
					`absolute inset-0 bg-black/20 flex flex-col justify-end p-4 rounded-lg transition-opacity`,
					isHovered || window.innerWidth < 768 ? 'opacity-100' : 'opacity-0'
				)}
			>
				<div className='flex items-center gap-1 mt-2'>
					<div className='flex items-center gap-1 text-white'>
						<RiHeart3Fill className='size-4' />
						<span>{likes}</span>
					</div>
					<div className='flex items-center gap-1 text-white'>
						<RiChat1Fill className='size-4' />
						<span>{commentCount}</span>
					</div>
				</div>

				<div className='flex items-start gap-2 text-white'>
					<Avatar className='h-8 w-8'>
						<AvatarImage src={post.user.avatarUrl || undefined} />
						<AvatarFallback className='text-black text-xs'>
							{getNameInitials(post.user.name)}
						</AvatarFallback>
					</Avatar>
					<div className='flex flex-col'>
						<span className='text-sm font-medium'>{post.user.name}</span>
						<p className='text-xs text-muted-foreground'>
							{formatTimeAgo(new Date(post.createdAt))}
						</p>
					</div>
				</div>

				{post.caption && (
					<p className='text-gray-200 font-medium text-xs whitespace-pre-wrap max-w-56 truncate my-1'>
						{post.caption}
					</p>
				)}

				<div className='absolute flex flex-col gap-3 bottom-12 right-2'>
					<button
						onClick={handleLike}
						className={cn(
							'bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition-colors z-50',
							currentUserLiked && 'text-red-500'
						)}
					>
						{currentUserLiked ? (
							<RiHeart3Fill className='h-5 w-5' />
						) : (
							<RiHeart3Line className='h-5 w-5' />
						)}
					</button>
					<button
						onClick={() => setIsCommentsOpen(true)}
						className='bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition-colors z-50'
					>
						<RiChat1Line className='size-5' />
					</button>
				</div>
			</div>

			<Comments
				postId={post.id}
				open={isCommentsOpen}
				onOpenChangeAction={setIsCommentsOpen}
				handleCommentAction={handleComment}
				handleDeleteCommentAction={handleDeleteComment}
				comments={comments}
				currentUserId={currentUserId}
			/>
		</div>
	);
}
