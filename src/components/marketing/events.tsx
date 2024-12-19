import { getEvents } from '@/sanity/lib/queries';
import React from 'react';
import Link from 'next/link';
import { type SanityDocument } from 'next-sanity';
import { client } from '@/sanity/lib/client';
import { formatEventDateTime } from '@/lib/formatters';

const options = { next: { revalidate: 30 } };

const EventsSection = async () => {
	const events = await client.fetch<SanityDocument[]>(getEvents, {}, options);

	return (
		<section className='flex flex-col w-full justify-center items-center py-16'>
			<div className='flex flex-col gap-6 max-w-4xl mt-6'>
				<h2 className='text-xl font-display text-center tracking-normal'>
					Upcoming Events
				</h2>
				<ul className='flex flex-col gap-y-4'>
					{events.map((event) => {
						const { date } = formatEventDateTime(event.date);
						return (
							<li className='hover:underline' key={event._id}>
								<Link href={`/${event.title}`}>
									<p>{date}</p>
									<h2 className='text-xl font-semibold'>{event.title}</h2>
									<p>{event.location}</p>
								</Link>
							</li>
						);
					})}
				</ul>
			</div>
		</section>
	);
};

export default EventsSection;
