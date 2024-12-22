'use client';

import { CalendarDays, MapPin, Users } from 'lucide-react';

import CreatePostButton from '@/components/create-post-button';
import { EventPostCard } from '@/components/event/post/post-card';
import { EventWithFullData } from '@/types/event';
import JoinChatRoom from '@/components/join-chat-room';
import { User } from '@supabase/supabase-js';
import { formatEventDateTime } from '@/lib/formatters';
import { useMediaQuery } from '@/hooks/useMediaQuery';

export default function EventRoom({
	user,
	event,
}: {
	user: (User & { username: string | null; avatarUrl: string | null }) | null;
	event: EventWithFullData;
}) {
	const { date, time } = formatEventDateTime(event.dateTime as never);
	const isSmallDevice = useMediaQuery('only screen and (max-width : 768px)');

	return (
		<div className='flex min-h-screen flex-col'>
			<main className='flex-1'>
				<div className='max-w-7xl px-6 py-6 mx-auto'>
					{/* Event Header */}
					<div className='mb-8'>
						<h1 className='text-2xl font-bold'>{event.name}</h1>
						<div className='flex flex-wrap items-center gap-6 mt-4 text-sm'>
							<div className='flex items-center gap-2'>
								<CalendarDays className='h-4 w-4' />
								<span>{date}</span>
								<span className='text-muted-foreground'>{time}</span>
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
			<div className='fixed bottom-8 right-8 flex flex-col gap-4 items-end'>
				<JoinChatRoom
					isSmallDevice={isSmallDevice}
					eventId={event.id}
					userName={user?.user_metadata.full_name ?? ''}
					userAvatar={user?.avatarUrl ?? ''}
				/>

				<CreatePostButton
					isSmallDevice={isSmallDevice}
					eventId={event.id}
					userName={user?.user_metadata.full_name ?? ''}
					userAvatar={user?.avatarUrl ?? ''}
				/>
			</div>
		</div>
	);
}
