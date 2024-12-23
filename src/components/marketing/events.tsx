'use client';

import { getEvents } from '@/sanity/lib/queries';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { type SanityDocument } from 'next-sanity';
import { client } from '@/sanity/lib/client';
import { Loader2 } from 'lucide-react';
//import { formatEventDateTime } from '@/lib/formatters';

//const options = { next: { revalidate: 30 } };

const EventsSection = () => {
	//const events = await client.fetch<SanityDocument[]>(getEvents, {}, options);
	const [events, setEvents] = useState<SanityDocument[]>([]);

	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchEvents = async () => {
			try {
				setIsLoading(true);
				const fetchedEvents = await client.fetch<SanityDocument[]>(
					getEvents,
					{},
					{ next: { revalidate: 30 } }
				);
				setEvents(fetchedEvents);
			} catch (err) {
				setError('Failed to load events. Please try again later.');
				console.error('Error fetching events:', err);
			} finally {
				setIsLoading(false);
			}
		};

		fetchEvents();
	}, []);

	const now = new Date();
	const upcomingEvents = events.filter((event) => new Date(event.date) >= now);
	const pastEvents = events.filter((event) => new Date(event.date) < now);

	if (isLoading) {
		return (
			<div className='flex justify-center items-center min-h-[400px]'>
				<Loader2 className='w-8 h-8 animate-spin text-gray-500' />
			</div>
		);
	}
	if (error) {
		return (
			<div className='flex justify-center items-center min-h-[400px]'>
				<p className=''>
					Error loading events, reload page or contact support.
				</p>
			</div>
		);
	}

	return (
		<section className='flex flex-col w-full justify-center items-center py-16'>
			<section className='py-12 px-4 w-full'>
				<EventList events={upcomingEvents} title='Upcoming Events' />
				<EventList events={pastEvents} title='Past Events' />
			</section>
		</section>
	);
};

export default EventsSection;

const EventList = ({
	events,
	title,
}: {
	events: SanityDocument[];
	title: string;
}) => {
	return (
		<div className='w-full max-w-4xl mx-auto mb-12'>
			<h2 className='text-2xl font-bold mb-6 border-b pb-2 font-display'>
				{title}
			</h2>
			{events.length === 0 ? (
				<p className='text-gray-500 italic'>
					No {title.toLowerCase()} to display
				</p>
			) : (
				<div className='space-y-1'>
					{events.map((event) => (
						<Link
							href={`${event.eventUrl}`}
							key={event._id}
							className='group block border-b last:border-b-0 hover:bg-gray-50/10 transition-colors'
						>
							<div className='py-4 px-3 flex justify-between items-center'>
								<div className='flex-1'>
									<div className='flex items-center gap-4'>
										<time className='text-sm text-gray-600 w-32'>
											{event.time}
										</time>
										<h3 className='font-medium group-hover:text-zinc-900 transition-colors'>
											{event.title}
										</h3>
									</div>
								</div>
								<div className='text-right text-sm text-gray-600 group-hover:text-zinc-900 '>
									{event.location}
								</div>
							</div>
						</Link>
					))}
				</div>
			)}
		</div>
	);
};
