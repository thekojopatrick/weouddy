'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { Badge } from '@/components/ui/badge';
import { PostData } from '@/types/event';
import { PostMediaSlider } from './post-media-slider';
import { User } from '@supabase/supabase-js';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface EventPostCardProps {
	post: PostData;
	currentUser: User | null;
}

export function EventPostCard({ post, currentUser }: EventPostCardProps) {
	const [isHovered, setIsHovered] = useState(false);

	return (
		<div
			className='relative group'
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<div className='relative'>
				<Badge variant='secondary' className='absolute left-4 top-4 z-10'>
					{post.userId === currentUser?.id ? 'Your post' : 'Member'}
				</Badge>

				<PostMediaSlider media={post.media} alt={post.caption || ''} />
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
						<AvatarFallback>{post.user.name[0]}</AvatarFallback>
					</Avatar>
					<span>{post.user.name}</span>
				</div>

				{post.caption && <p className='text-white mt-2'>{post.caption}</p>}

				<div className='flex items-center gap-4 mt-4'>
					<div className='flex items-center gap-1 text-white'>
						<span>{post.likes.length}</span>
						<span>likes</span>
					</div>
					<div className='flex items-center gap-1 text-white'>
						<span>{post.comments.length}</span>
						<span>comments</span>
					</div>
				</div>
			</div>
		</div>
	);
}
