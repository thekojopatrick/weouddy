'use client';

import { useCallback, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { CategoryFilters } from '@/components/category-filters';
import { EventCard } from '@/components/event/event-card';
import { EventData } from '@/types/event';
import { LocationFilters } from '@/components/location-filters';
import { SiteHeader } from '@/components/site-header';
import { User } from '@supabase/supabase-js';
import { UserPlus } from 'lucide-react';
import { formatDate } from 'date-fns';
import { usePathname } from 'next/navigation';

const locations = [
	{ name: 'Accra', href: 'accra' },
	{ name: 'Ghana', href: 'gh' },
	{ name: 'Africa', href: 'africa' },
	{ name: 'Rest of the world', href: 'world' },
];

export default function HomePage({
	user,
	events,
}: {
	user: User | null;
	events: EventData[];
}) {
	const [filteredEvents, setFilteredEvents] = useState(events);
	const [currentLocation, setCurrentLocation] = useState('Accra');
	const [currentCategory, setCurrentCategory] = useState('All');

	const pathname = usePathname();

	useEffect(() => {
		const path = pathname.split('/')[2];
		if (path) {
			const location =
				locations.find((loc) => loc.href.includes(path))?.name || 'Accra';
			setCurrentLocation(location);
			filterEvents(location, currentCategory);
		}
	}, [currentCategory, pathname]);

	const filterEvents = (location: string, category: string) => {
		let filtered = events;
		if (location !== 'Rest of the world') {
			filtered = filtered.filter((event) => event.location === location);
		}
		if (category !== 'All') {
			filtered = filtered.filter((event) => event?.type === category);
		}
		setFilteredEvents(filtered);
	};

	const handleLocationChange = (location: string) => {
		setCurrentLocation(location);
		filterEvents(location, currentCategory);
	};

	const handleCategoryChange = useCallback(
		(category: string) => {
			setCurrentCategory(category);
			filterEvents(currentLocation, category);
		},
		[currentLocation]
	);

	const availableCategories = [
		'All',
		...new Set(filteredEvents.map((event) => event.type)),
	];

	return (
		<div className='flex min-h-screen flex-col'>
			<SiteHeader user={user} />
			<main className='flex-1'>
				<section className='max-w-7xl px-6 py-8 mx-auto'>
					<div className='flex flex-col gap-4'>
						<h1 className='text-3xl font-bold tracking-tighter'>
							Discover Events
						</h1>
						<p className='text-muted-foreground'>
							Explore events near you, browse by category, or search events by
							name.
						</p>
					</div>
					<div className='mt-8'>
						<LocationFilters
							currentLocation={currentLocation}
							onLocationChangeAction={handleLocationChange}
						/>
						<CategoryFilters
							onCategoryChangeAction={handleCategoryChange}
							currentCategory={currentCategory}
							categories={availableCategories}
						/>
					</div>
					<div className='mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
						{filteredEvents.map((event) => (
							<EventCard
								key={event.id}
								name={event.name}
								type={event.type}
								coverImage={event.coverImage}
								isPrivate={event.isPrivate}
								host={event.host}
								location={event.location!}
								members={event?._count?.members}
								category={event.type}
								date={formatDate(new Date(event.dateTime), 'dd/MM/yyyy')}
								time={formatDate(new Date(event.dateTime), 'HH:mm')}
								description={event.description!}
							/>
						))}
					</div>
				</section>
			</main>
			<div className='fixed bottom-8 right-8 flex flex-col gap-4'>
				<Button size='lg' className='rounded-full shadow-lg'>
					<UserPlus className='mr-2 h-5 w-5' />
					Join Event
				</Button>
			</div>
		</div>
	);
}
