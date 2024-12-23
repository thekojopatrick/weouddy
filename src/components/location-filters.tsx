'use client';

import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

const locations = [
	{ name: 'Accra', param: 'accra' },
	{ name: 'Takoradi', param: 'takoradi' },
	{ name: 'Ghana', param: 'gh' },
	{ name: 'Africa', param: 'africa' },
	{ name: 'Rest of the world', param: 'world' },
];

interface LocationFiltersProps {
	currentLocation: string;
	onLocationChangeAction: (location: string) => void;
}

export function LocationFilters({
	currentLocation,
	onLocationChangeAction,
}: LocationFiltersProps) {
	const router = useRouter();

	const handleLocationClick = (locationParam: string) => {
		onLocationChangeAction(locationParam);
		router.push(`/discover?location=${locationParam}`, { scroll: false });
	};

	return (
		<nav className='flex space-x-4 border-b pb-4'>
			{locations.map((location) => (
				<button
					key={location.name}
					onClick={() => handleLocationClick(location.param)}
					className={cn(
						'text-sm font-medium transition-colors hover:text-primary',
						currentLocation === location.param
							? 'text-primary'
							: 'text-muted-foreground'
					)}
				>
					{location.name}
				</button>
			))}
		</nav>
	);
}
