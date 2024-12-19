import { getEvents } from '@/sanity/lib/queries';
import React from 'react';
import Link from 'next/link';
import { type SanityDocument } from 'next-sanity';
import { client } from '@/sanity/lib/client';
//import { formatEventDateTime } from '@/lib/formatters';

const options = { next: { revalidate: 30 } };

const EventsSection = async () => {
	const events = await client.fetch<SanityDocument[]>(getEvents, {}, options);

	const now = new Date();
	const upcomingEvents = events.filter((event) => new Date(event.date) >= now);
	const pastEvents = events.filter((event) => new Date(event.date) < now);

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
			<h2 className='text-xl font-bold mb-6 border-b pb-2 font-display'>
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
							href={`/${event.title}`}
							key={event._id}
							className='group block border-b last:border-b-0 hover:bg-gray-50 transition-colors'
						>
							<div className='py-4 px-3 flex justify-between items-center'>
								<div className='flex-1'>
									<div className='flex items-center gap-4'>
										<time className='text-sm text-gray-600 w-32'>
											{new Date(event.date).toLocaleDateString('en-US', {
												month: 'short',
												day: 'numeric',
												hour: 'numeric',
												minute: '2-digit',
											})}
										</time>
										<h3 className='font-medium group-hover:text-blue-600 transition-colors'>
											{event.title}
										</h3>
									</div>
								</div>
								<div className='text-right text-sm text-gray-600'>
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
