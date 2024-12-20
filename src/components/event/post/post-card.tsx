'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { Badge } from '@/components/ui/badge';
import { PostMediaSlider } from '@/components/post-media-slider';
import { PostWithDetails } from '@/types/prisma.types';
import { cn } from '@/lib/utils';
import { formatEventDateTime } from '@/lib/formatters';
import { useState } from 'react';

interface EventPostCardProps {
	post: PostWithDetails;
	userId: string;
}

export function EventPostCard({ post, userId }: EventPostCardProps) {
	const [isHovered, setIsHovered] = useState(false);

	const { time } = formatEventDateTime(post.createdAt as never);

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
				<div className='flex items-center gap-2 text-white'>
					<Avatar className='h-8 w-8'>
						<AvatarImage src={post.user.avatarUrl || undefined} />
						<AvatarFallback className='text-black'>
							{post.user.name[0]}
						</AvatarFallback>
					</Avatar>
					<span>{post.user.name}</span>
				</div>

				{post.caption && <p className='text-white mt-2'>{post.caption}</p>}

				<div className='flex items-center gap-4 mt-2'>
					<div className='flex items-center gap-1 text-white'>
						<span>{post._count?.likes}</span>
						<span>likes</span>
					</div>
					<div className='flex items-center gap-1 text-white'>
						<span>{post._count?.comments}</span>
						<span>comments</span>
					</div>
				</div>
				<p className='text-sm text-muted-foreground'>{time}</p>
			</div>
		</div>
	);
}
