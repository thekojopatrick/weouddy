'use client';

import { Plus, UserPlus } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { CategoryFilters } from '@/components/category-filters';
import { EventCard } from '@/components/event-card';
import { LocationFilters } from '@/components/location-filters';
import { SiteHeader } from '@/components/site-header';
import { User } from '@supabase/supabase-js';
import { usePathname } from 'next/navigation';

const locations = [
	{ name: 'Accra', href: 'accra' },
	{ name: 'Ghana', href: 'gh' },
	{ name: 'Africa', href: 'africa' },
	{ name: 'Rest of the world', href: 'world' },
];

const allEvents = [
	{
		title: 'Sweet 16 Birthday',
		type: 'Birthday',
		image: '/placeholder.svg',
		isPublic: true,
		host: {
			name: 'Kojo Patrick',
			avatar: '/placeholder.svg',
		},
		location: 'Accra',
		members: 0,
		category: 'House Party',
		date: '2024-03-20',
		time: '14:00',
		description: 'Join us for an amazing sweet 16 celebration!',
	},
	{
		title: 'Bachelor Party',
		type: 'Party',
		image: '/placeholder.svg',
		isPublic: false,
		host: {
			name: 'Lila Anderson',
			avatar: '/placeholder.svg',
		},
		location: 'Ghana',
		members: 5,
		category: 'Club',
		date: '2024-03-20',
		time: '14:00',
		description: 'Join us for an amazing bachelor party!',
	},
	{
		title: 'Company Retreat',
		type: 'Retreat',
		image: '/placeholder.svg',
		isPublic: true,
		host: {
			name: 'Sophie Lee',
			avatar: '/placeholder.svg',
		},
		location: 'Africa',
		members: 20,
		category: 'Outdoor Event',
		date: '2024-03-20',
		time: '14:00',
		description: 'Join us for an amazing company retreat!',
	},
	{
		title: 'Family Reunion',
		type: 'Reunion',
		image: '/placeholder.svg',
		isPublic: false,
		host: {
			name: 'James Smith',
			avatar: '/placeholder.svg',
		},
		location: 'Rest of the world',
		members: 10,
		category: 'House Party',
		date: '2024-03-20',
		time: '14:00',
		description: 'Join us for an amazing family reunion!',
	},
	{
		title: 'Sunday Service',
		type: 'Religious',
		image: '/placeholder.svg',
		isPublic: true,
		host: {
			name: 'Pastor Johnson',
			avatar: '/placeholder.svg',
		},
		location: 'Accra',
		members: 100,
		category: 'Church',
		date: '2024-03-20',
		time: '14:00',
		description: 'Join us for an amazing Sunday service!',
	},
	{
		title: 'Beach Wedding',
		type: 'Wedding',
		image: '/placeholder.svg',
		isPublic: false,
		host: {
			name: 'Emma and John',
			avatar: '/placeholder.svg',
		},
		location: 'Ghana',
		members: 50,
		category: 'Weddings',
		date: '2024-03-20',
		time: '14:00',
		description: 'Join us for an amazing beach wedding!',
	},
];

export default function HomePage({ user }: { user: User | null }) {
	const [filteredEvents, setFilteredEvents] = useState(allEvents);
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
		let filtered = allEvents;
		if (location !== 'Rest of the world') {
			filtered = filtered.filter((event) => event.location === location);
		}
		if (category !== 'All') {
			filtered = filtered.filter((event) => event.category === category);
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
		...new Set(filteredEvents.map((event) => event.category)),
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
							<EventCard key={event.title} {...event} />
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
