'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, MapPin, MessageCircle, Plus, Users } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CreatePostModal } from '@/components/create-post-modal';
import { EventWithFullData } from '@/types/event';
import Image from 'next/image';
import { SiteHeader } from '@/components/site-header';
import { User } from '@supabase/supabase-js';
import { cn } from '@/lib/utils';
import { formatDate } from 'date-fns';
import { useState } from 'react';

export default function EventRoom({
	user,
	event,
}: {
	user: User | null;
	event: EventWithFullData;
}) {
	const [hoveredPost, setHoveredPost] = useState<string | null>(null);
	const [open, setOpen] = useState(false);

	return (
		<div className='flex min-h-screen flex-col'>
			<SiteHeader user={user} />
			<main className='flex-1'>
				<div className='max-w-7xl px-6 py-6'>
					<div className='mb-8'>
						<h1 className='text-2xl font-bold'>{event.name}</h1>
						<div className='flex flex-wrap items-center gap-6 mt-4 text-sm'>
							<div className='flex items-center gap-2'>
								<Calendar className='h-4 w-4' />
								<span>{formatDate(event.dateTime, 'dd/mm/yyyy')}</span>
								<span className='text-muted-foreground'>9:00 PM</span>
							</div>
							<div className='flex items-center gap-2'>
								<MapPin className='h-4 w-4' />
								<span>{event.location}</span>
								<span className='text-muted-foreground'>{event.location}</span>
							</div>
							<div className='flex items-center gap-2'>
								<Users className='h-4 w-4' />
								<span>{event.members.length} Members</span>
								<span className='text-muted-foreground'>
									{event.posts.length} posts
								</span>
							</div>
						</div>
					</div>

					<div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
						{event?.posts.map((post) => (
							<div
								key={post.id}
								className='relative group'
								onMouseEnter={() => setHoveredPost(post.id)}
								onMouseLeave={() => setHoveredPost(null)}
							>
								<div className='relative aspect-square'>
									<Badge
										variant='secondary'
										className='absolute left-4 top-4 z-10'
									>
										{post.userId === user?.id ? 'Your post' : 'Member'}
									</Badge>

									<Image
										src={post.mediaUrl ?? '/placeholder.svg'}
										alt={post.caption ?? 'Post image'}
										fill
										className='object-cover rounded-lg'
									/>
								</div>
								<div
									className={cn(
										`absolute inset-0 bg-black/60 flex flex-col justify-end p-4 rounded-lg transition-opacity ${hoveredPost === post.id || window.innerWidth < 768 ? 'opacity-100' : 'opacity-0'}`
									)}
								>
									<div className='flex items-center gap-2 text-white'>
										<Avatar className='h-8 w-8'>
											<AvatarImage src={post.user.avatarUrl} />
											<AvatarFallback>{post.user.name[0]}</AvatarFallback>
										</Avatar>
										<span>{post.user.name}</span>
									</div>
									<p className='text-white mt-2'>{post.caption}</p>
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
						))}
					</div>
				</div>
			</main>

			<div className='fixed bottom-8 right-8 flex flex-col gap-4'>
				<Button size='lg' className='rounded-full shadow-lg'>
					<MessageCircle className='mr-2 h-5 w-5' />
					Join Chatroom
				</Button>
				<Button
					size='lg'
					className='rounded-full shadow-lg'
					onClick={() => setOpen(true)}
				>
					<Plus className='mr-2 h-5 w-5' />
					Create Post
				</Button>
			</div>
			<CreatePostModal open={open} onOpenChangeAction={setOpen} />
		</div>
	);
}
