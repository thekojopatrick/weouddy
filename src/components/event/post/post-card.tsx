'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
	RiChat1Fill,
	RiChat1Line,
	RiHeart3Fill,
	RiHeart3Line,
} from '@remixicon/react';

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
				<div className='flex items-center gap-1 mt-2'>
					<div className='flex items-center gap-1 text-white'>
						<RiHeart3Fill className='size-4' />
						<span>{post._count?.likes}</span>
					</div>
					<div className='flex items-center gap-1 text-white'>
						<RiChat1Fill className='size-4' />
						<span>{post._count?.comments}</span>
					</div>
				</div>
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

				<p className='text-sm text-muted-foreground'>{time}</p>

				<div className='absolute flex flex-col gap-3 bottom-12 right-2'>
					<button
						onClick={() => console.log('like')}
						className={`bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition-colors z-50 ${isHovered ? 'text-red-500' : ''}`}
					>
						<RiHeart3Line className='h-5 w-5' />
					</button>
					<button
						onClick={() => console.log('comment')}
						className='bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition-colors z-50'
					>
						<RiChat1Line className='size-5' />
					</button>
				</div>
			</div>
		</div>
	);
}
