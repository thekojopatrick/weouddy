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
import { useEffect, useState } from 'react';
import usePlacesAutocomplete, {
	getGeocode,
	getLatLng,
} from 'use-places-autocomplete';

import { Button } from '@/components/ui/button';
import { ResponsiveDialog } from '@/components/ui/responsive-dialog';
import { toast } from 'sonner';
import { useJsApiLoader } from '@react-google-maps/api';

interface Location {
	name: string;
	address: string;
	lat: number;
	lng: number;
	placeId?: string;
	types?: string[];
	subtitle?: string;
}

interface LocationModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSelectLocation: (location: Location) => void;
}

const GoogleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;

const predefinedLocations: Location[] = [
	{
		name: 'United States',
		address: 'United States',
		lat: 37.0902,
		lng: -95.7129,
		types: ['country'],
	},
	{
		name: 'United Kingdom',
		address: 'United Kingdom',
		lat: 55.3781,
		lng: -3.436,
		types: ['country'],
	},
	{
		name: 'Accra, Ghana',
		address: 'Accra, Ghana',
		lat: 5.6037,
		lng: -0.187,
		subtitle: 'Capital City',
		types: ['locality', 'political'],
	},
	{
		name: 'Takoradi',
		address: 'Takoradi, Ghana',
		lat: 4.8757,
		lng: -1.7831,
		subtitle: 'Western Region',
		types: ['locality', 'political'],
	},
];

export function LocationModal({
	open,
	onOpenChange,
	onSelectLocation,
}: LocationModalProps) {
	const [isLoading, setIsLoading] = useState(false);

	const { isLoaded, loadError } = useJsApiLoader({
		id: 'google-map-script',
		googleMapsApiKey: GoogleMapsApiKey,
	});

	const {
		ready,
		value,
		suggestions: { status, data },
		setValue,
		clearSuggestions,
	} = usePlacesAutocomplete({
		callbackName: 'initMap',
		requestOptions: {
			/* Define search scope here */
		},
		debounce: 300,
	});

	useEffect(() => {
		console.log('Google Maps Script Loading:', {
			isLoaded,
			loadError,
			apiKey: GoogleMapsApiKey ? 'Key Present' : 'Key Missing',
		});
	}, [isLoaded, loadError]);

	const handleSelect = async (description: string, placeId?: string) => {
		try {
			setIsLoading(true);
			setValue(description, false);
			clearSuggestions();

			// First, check if it's a predefined location
			const predefinedLocation = predefinedLocations.find(
				(loc) => loc.name === description || loc.address === description
			);

			if (predefinedLocation) {
				onSelectLocation(predefinedLocation);
				onOpenChange(false);
				return;
			}

			// If not predefined, fetch full details
			if (placeId) {
				const locationDetails = await fetchFullLocationDetails(placeId);
				if (locationDetails) {
					onSelectLocation(locationDetails);
					onOpenChange(false);
				} else {
					toast.error('Could not fetch location details');
				}
			} else {
				// Fallback to geocoding
				const results = await getGeocode({ address: description });
				const { lat, lng } = await getLatLng(results[0]);
				onSelectLocation({
					name: description,
					address: results[0].formatted_address,
					lat,
					lng,
				});
				onOpenChange(false);
			}
		} catch (error) {
			console.error('Error selecting location:', error);
			toast.error('Error selecting location');
		} finally {
			setIsLoading(false);
		}
	};

	const fetchFullLocationDetails = async (
		placeId: string
	): Promise<Location | null> => {
		try {
			const response = await fetch(
				`https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GoogleMapsApiKey}`
			);
			const data = await response.json();

			if (data.result) {
				const result = data.result;
				return {
					name: result.name,
					address: result.formatted_address,
					lat: result.geometry.location.lat,
					lng: result.geometry.location.lng,
					placeId: result.place_id,
					types: result.types,
					subtitle: result.vicinity,
				};
			}
			return null;
		} catch (error) {
			console.error('Error fetching place details:', error);
			return null;
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
							const locationDetails: Location = {
								name: data.results[0].address_components[0].long_name,
								address: data.results[0].formatted_address,
								lat,
								lng,
								types: data.results[0].types,
							};
							onSelectLocation(locationDetails);
							onOpenChange(false);
						}
					} catch (error) {
						console.error('Error:', error);
						toast.error('Could not retrieve current location');
					} finally {
						setIsLoading(false);
					}
				},
				(error) => {
					console.error('Geolocation error:', error);
					toast.error('Geolocation access denied');
					setIsLoading(false);
				}
			);
		} else {
			toast.error('Geolocation is not supported by this browser');
		}
	};

	if (loadError) {
		return (
			<ResponsiveDialog open={open} onOpenChangeAction={onOpenChange}>
				<div className='p-4 text-red-500'>
					Error loading Google Maps: {loadError.message}
					<Button onClick={() => window.location.reload()} className='mt-2'>
						Retry Loading
					</Button>
				</div>
			</ResponsiveDialog>
		);
	}

	if (!isLoaded) {
		return (
			<ResponsiveDialog open={open} onOpenChangeAction={onOpenChange}>
				<div className='flex justify-center items-center p-6'>
					<Loader2 className='h-8 w-8 animate-spin' />
				</div>
			</ResponsiveDialog>
		);
	}

	return (
		<ResponsiveDialog open={open} onOpenChangeAction={onOpenChange}>
			<div className='space-y-4 py-4'>
				<div className='flex items-center gap-2 px-4'>
					<Button
						variant='ghost'
						size='icon'
						onClick={() => onOpenChange(false)}
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
										key={location.name}
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
