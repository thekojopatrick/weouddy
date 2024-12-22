'use client';

import { Calendar, MapPin, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { EmptyEvents } from './empty-states';
import { EventWithDetails } from '@/types/prisma.types';
import Image from 'next/image';
import Link from 'next/link';
import { fetchUserEvents } from '@/server/actions/user/queries';

interface UserEventsProps {
	userId: string;
}

export function UserEvents({ userId }: UserEventsProps) {
	const [events, setEvents] = useState<EventWithDetails[]>([]);
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const [isLoading, setIsLoading] = useState(false);
	const [eventType, setEventType] = useState<'all' | 'hosted' | 'joined'>(
		'all'
	);

	const loadEvents = async () => {
		setIsLoading(true);
		try {
			const newEvents = await fetchUserEvents(userId, page);

			if (newEvents.length === 0) {
				setHasMore(false);
			} else {
				setEvents((prev) => (page === 1 ? newEvents : [...prev, ...newEvents]));
			}
		} catch (error) {
			console.error('Failed to load events', error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		loadEvents();
	}, [userId, page, eventType]);

	const handleLoadMore = () => {
		setPage((prev) => prev + 1);
	};

	const filteredEvents = events.filter((event) => {
		if (eventType === 'hosted') return event.hostId === userId;
		if (eventType === 'joined') return event.hostId !== userId;
		return true;
	});

	if (filteredEvents.length === 0 && !isLoading) {
		return <EmptyEvents />;
	}

	return (
		<div className='container mx-auto px-4 py-6'>
			<div className='flex justify-center space-x-4 mb-6'>
				{['all', 'hosted', 'joined'].map((type) => (
					<Button
						key={type}
						variant={eventType === type ? 'default' : 'outline'}
						onClick={() => setEventType(type as 'all' | 'hosted' | 'joined')}
					>
						{type === 'all'
							? 'All Events'
							: type === 'hosted'
								? 'Hosted'
								: 'Joined'}
					</Button>
				))}
			</div>

			<div className='grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
				{filteredEvents.map((event) => (
					<Card key={event.id} className='hover:shadow-lg transition-shadow'>
						{event.coverImage && (
							<div className='relative w-full aspect-video'>
								<Image
									src={event.coverImage}
									alt={event.name}
									fill
									className='object-cover w-full h-full'
								/>
							</div>
						)}
						<CardHeader>
							<CardTitle>{event.name}</CardTitle>
						</CardHeader>
						<CardContent>
							<div className='space-y-2'>
								<div className='flex items-center text-muted-foreground'>
									<Calendar className='w-4 h-4 mr-2' />
									{new Date(event.dateTime).toLocaleDateString()}
								</div>
								<div className='flex items-center text-muted-foreground'>
									<MapPin className='w-4 h-4 mr-2' />
									{event.location || 'Online'}
								</div>
								<div className='flex items-center text-muted-foreground'>
									<Users className='w-4 h-4 mr-2' />
									{event.memberCount} Members
								</div>
								<div className='flex justify-between items-center mt-4'>
									<span className='text-sm'>Hosted by {event.host.name}</span>
									<Link href={`/events/${event.slug}`}>
										<Button variant='outline' size='sm'>
											View Details
										</Button>
									</Link>
								</div>
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			{hasMore && (
				<div className='flex justify-center mt-6'>
					<Button onClick={handleLoadMore} disabled={isLoading}>
						{isLoading ? 'Loading...' : 'Load More Events'}
					</Button>
				</div>
			)}
		</div>
	);
}
