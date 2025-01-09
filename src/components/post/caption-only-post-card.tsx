'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { RiChat1Line, RiHeart3Fill, RiHeart3Line } from '@remixicon/react';

import { Badge } from '@/components/ui/badge';
import { Comments } from './comment-post-dialog';
import { EventPostCardProps } from './post-card';
import React from 'react';
import { formatTimeAgo } from '@/lib/formatters';
import { getNameInitials } from '@/lib/utils';
import { usePostInteractions } from '@/hooks/use-post-interaction';

export default function CaptionOnlyPostCard({
	post,
	userId,
}: EventPostCardProps) {
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

	return (
		<div className='border bg-card p-4 rounded-lg space-y-4 max-h-fit'>
			<div className='flex justify-between items-start'>
				<div className='flex items-center gap-2'>
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
				<Badge variant='secondary'>
					{post.userId === userId ? 'Your post' : 'Member'}
				</Badge>
			</div>

			<p className='font-medium text-sm whitespace-pre-wrap'>{post.caption}</p>

			<div className='flex gap-3'>
				<button
					onClick={handleLike}
					className='flex items-center gap-1.5 hover:text-primary transition-colors'
				>
					{isLiked ? (
						<RiHeart3Fill className='h-5 w-5 text-red-500' />
					) : (
						<RiHeart3Line className='h-5 w-5' />
					)}
					<span className='text-sm'>{likes}</span>
				</button>
				<button
					onClick={() => setIsCommentsOpen(true)}
					className='flex items-center gap-1.5 hover:text-primary transition-colors'
				>
					<RiChat1Line className='h-5 w-5' />
					<span className='text-sm'>{commentCount}</span>
				</button>
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
