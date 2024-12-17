'use client';

import { Plus, UserPlus } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { CategoryFilters } from '@/components/category-filters';
import { EventCard } from '@/components/event/event-card';
import { EventData } from '@/types/event';
import { LocationFilters } from '@/components/location-filters';
import { User } from '@supabase/supabase-js';
import { formatDate } from 'date-fns';
import { useSearchParams } from 'next/navigation';

export default function DiscoverPage({
	events,
}: {
	user?: User | null;
	events: EventData[];
}) {
	const [filteredEvents, setFilteredEvents] = useState(events);
	const [currentCategory, setCurrentCategory] = useState('All');
	const [currentLocation, setCurrentLocation] = useState('accra');
	const searchParams = useSearchParams();

	useEffect(() => {
		const location = searchParams.get('location') || 'accra';
		setCurrentLocation(location);
		filterEvents(location, currentCategory);
	}, [searchParams, currentCategory]);

	const filterEvents = (location: string, category: string) => {
		let filtered = events;

		// Filter by location
		if (location !== 'world') {
			filtered = filtered.filter((event) =>
				event?.location?.toLowerCase().includes(location.toLowerCase())
			);
		}

		// Filter by category
		if (category !== 'All') {
			filtered = filtered.filter(
				(event) => event.type.toLowerCase() === category.toLowerCase()
			);
		}

		setFilteredEvents(filtered);
	};

	const handleLocationChange = (location: string) => {
		setCurrentLocation(location);
		filterEvents(location, currentCategory);
	};

	const handleCategoryChange = (category: string) => {
		setCurrentCategory(category);
		filterEvents(currentLocation, category);
	};

	const availableCategories = [
		'All',
		...new Set(events.map((event) => event.type)),
	];

	return (
		<div className='flex min-h-screen flex-col'>
			<main className='flex-1'>
				<section className='max-w-7xl px-6 py-8 '>
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
						{filteredEvents?.map((event) => (
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
				<Button size='lg' className='rounded-full shadow-lg'>
					<Plus className='mr-2 h-5 w-5' />
					Create Event
				</Button>
			</div>
		</div>
	);
}
