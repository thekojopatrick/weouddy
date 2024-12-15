'use client';

import { ArrowLeft, Loader2, MapPin, Navigation } from 'lucide-react';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command';
import usePlacesAutocomplete, {
	getGeocode,
	getLatLng,
} from 'use-places-autocomplete';

import { Button } from '@/components/ui/button';
import { ResponsiveDialog } from '@/components/ui/responsive-dialog';
import { useLoadScript } from '@react-google-maps/api';
import { useState } from 'react';

interface Location {
	address: string;
	lat: number;
	lng: number;
	subtitle?: string;
}

interface LocationModalProps {
	open: boolean;
	onOpenChangeAction: (open: boolean) => void;
	onSelectLocationAction: (location: Location) => void;
}

const GoogleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;

const predefinedLocations = [
	{ name: 'United States', value: 'US' },
	{ name: 'United Kingdom', value: 'UK' },
	{ name: 'Ghana', value: 'GH' },
	{
		name: 'Accra, Ghana',
		value: 'accra',
		subtitle: 'East Legon',
	},
	{
		name: 'Takoradi',
		value: 'takoradi',
		subtitle: 'Airport Ridge, 32 Derrick Ave',
	},
];

export function LocationModal({
	open,
	onOpenChangeAction,
	onSelectLocationAction,
}: LocationModalProps) {
	const [isLoading, setIsLoading] = useState(false);
	const { isLoaded } = useLoadScript({
		googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
		libraries: ['places'],
	});

	console.log({ isLoaded });

	const {
		ready,
		value,
		suggestions: { status, data },
		setValue,
		clearSuggestions,
	} = usePlacesAutocomplete({
		callbackName: 'YOUR_CALLBACK_NAME',
		requestOptions: {
			/* Define search scope here */
		},
		debounce: 300,
	});

	const handleSelect = async (address: string) => {
		setValue(address, false);
		clearSuggestions();

		try {
			const results = await getGeocode({ address });
			const { lat, lng } = await getLatLng(results[0]);
			onSelectLocationAction({ address, lat, lng });
			onOpenChangeAction(false);
		} catch (error) {
			console.error('Error:', error);
		}
	};

	const getCurrentLocation = () => {
		setIsLoading(true);
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				async (position) => {
					const { latitude: lat, longitude: lng } = position.coords;
					try {
						const response = await fetch(
							`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GoogleMapsApiKey}`
						);
						const data = await response.json();
						if (data.results[0]) {
							onSelectLocationAction({
								address: data.results[0].formatted_address,
								lat,
								lng,
							});
							onOpenChangeAction(false);
						}
					} catch (error) {
						console.error('Error:', error);
					} finally {
						setIsLoading(false);
					}
				},
				(error) => {
					console.error('Error:', error);
					setIsLoading(false);
				}
			);
		}
	};

	if (!isLoaded) return null;

	return (
		<ResponsiveDialog open={open} onOpenChangeAction={onOpenChangeAction}>
			<div className='space-y-4 py-4'>
				<div className='flex items-center gap-2 px-4'>
					<Button
						variant='ghost'
						size='icon'
						onClick={() => onOpenChangeAction(false)}
					>
						<ArrowLeft className='h-4 w-4' />
					</Button>
					<h2 className='text-lg font-semibold'>Enter your address</h2>
				</div>

				<div className='px-4'>
					<Command>
						<CommandInput
							placeholder='Enter location'
							value={value}
							onValueChange={setValue}
							disabled={!ready}
						/>
						<CommandList>
							<CommandEmpty>No results found.</CommandEmpty>
							<CommandGroup>
								<CommandItem
									onSelect={() => getCurrentLocation()}
									className='flex items-center gap-2'
								>
									{isLoading ? (
										<Loader2 className='h-4 w-4 animate-spin' />
									) : (
										<Navigation className='h-4 w-4' />
									)}
									Use my current location
								</CommandItem>

								{status === 'OK' &&
									data.map(({ place_id, description }) => (
										<CommandItem
											key={place_id}
											onSelect={() => handleSelect(description)}
										>
											<MapPin className='mr-2 h-4 w-4' />
											{description}
										</CommandItem>
									))}

								{predefinedLocations.map((location) => (
									<CommandItem
										key={location.value}
										onSelect={() => handleSelect(location.name)}
										className='flex flex-col items-start'
									>
										<div className='flex items-center gap-2'>
											<MapPin className='h-4 w-4' />
											{location.name}
										</div>
										{location.subtitle && (
											<span className='ml-6 text-sm text-muted-foreground'>
												{location.subtitle}
											</span>
										)}
									</CommandItem>
								))}
							</CommandGroup>
						</CommandList>
					</Command>
				</div>

				<div className='px-4'>
					<Button
						className='w-full'
						onClick={() => {
							if (value) {
								handleSelect(value);
							}
						}}
						disabled={!value}
					>
						Use the address entered
					</Button>
				</div>
			</div>
		</ResponsiveDialog>
	);
}
