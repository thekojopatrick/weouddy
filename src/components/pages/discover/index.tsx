'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, UserPlus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { CategoryFilters } from '@/components/category-filters';
import { CreateEventButton } from '@/components/create-button';
import { EventCard } from '@/components/event/event-card';
import { EventData } from '@/types/event';
import { EventListShimmer } from '@/components/event/shimmer-loading';
import { LocationFilters } from '@/components/location-filters';
import { formatEventDateTime } from '@/lib/formatters';
import { useOptimizedEventFiltering } from '@/hooks/use-optimized-event-location';

export default function DiscoverPage({ events }: { events: EventData[] }) {
	const searchParams = useSearchParams();
	const router = useRouter();

	const [currentLocation, setCurrentLocation] = useState(
		searchParams.get('location') || 'accra'
	);
	const [currentCategory, setCurrentCategory] = useState('All');

	const { filterEvents, isLoading, error } = useOptimizedEventFiltering(events);

	// Compute filtered events
	const { data: filteredEvents, isLoading: filterLoading } = useMemo(
		() => filterEvents(currentLocation, currentCategory),
		[currentLocation, currentCategory, filterEvents]
	);

	// Handle location change
	const handleLocationChange = (location: string) => {
		setCurrentLocation(location);
		router.push(`/discover?location=${location}`, { scroll: false });
	};

	// Compute available categories
	const availableCategories = useMemo(
		() => ['All', ...new Set(events.map((event) => event.type))],
		[events]
	);

	// Render error state
	if (error) {
		return (
			<Alert variant='destructive' className='m-4'>
				<AlertTriangle className='h-4 w-4' />
				<AlertTitle>Error</AlertTitle>
				<AlertDescription>
					{error.message || 'An unexpected error occurred'}
				</AlertDescription>
			</Alert>
		);
	}

	// Render loading state
	if (isLoading || filterLoading) {
		return (
			<div className='container mx-auto px-4 py-8'>
				<EventListShimmer />
			</div>
		);
	}

	return (
		<div className='flex min-h-screen flex-col'>
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
							onCategoryChangeAction={setCurrentCategory}
							currentCategory={currentCategory}
							categories={availableCategories}
						/>
					</div>

					{filteredEvents.length === 0 ? (
						<div className='text-center py-8'>
							<p className='text-muted-foreground'>
								No events found for the selected filters.
							</p>
						</div>
					) : (
						<div className='mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
							{filteredEvents.map((event) => {
								const { date, time } = formatEventDateTime(
									event.dateTime as never
								);
								return (
									<EventCard
										key={event.id}
										{...event}
										date={date}
										time={time}
										members={event._count.members}
										category={event.type}
										location={event.location!}
										description={event.description!}
									/>
								);
							})}
						</div>
					)}
				</section>
			</main>
			<div className='fixed bottom-8 right-8 flex flex-col gap-4'>
				<Button size='lg' className='rounded-full shadow-lg'>
					<UserPlus className='mr-2 h-5 w-5' />
					Join Event
				</Button>
				<CreateEventButton />
			</div>
		</div>
	);
}
