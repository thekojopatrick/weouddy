'use client';

import { Calendar, MapPin, MessageCircle, Plus, Users } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { CreatePostModal } from '@/components/create-post-modal';
import { EventPostCard } from '@/components/event/post/post-card';
import { EventWithFullData } from '@/types/event';
import { SiteHeader } from '@/components/site-header';
import { User } from '@supabase/supabase-js';
import { formatDate } from 'date-fns';
import { useState } from 'react';

export default function EventRoom({
	user,
	event,
}: {
	user: User | null;
	event: EventWithFullData;
}) {
	const [open, setOpen] = useState(false);

	return (
		<div className='flex min-h-screen flex-col'>
			<SiteHeader user={user} />
			<main className='flex-1'>
				<div className='max-w-7xl px-6 py-6'>
					{/* Event Header */}
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

					{/* Posts Grid */}
					<div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
						{event?.posts.map((post) => (
							<EventPostCard
								key={post.id}
								post={post}
								userId={user?.id as never}
							/>
						))}
					</div>
				</div>
			</main>

			{/* Action Buttons */}
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

			<CreatePostModal
				open={open}
				onOpenChangeAction={setOpen}
				eventId={event.id}
			/>
		</div>
	);
}
