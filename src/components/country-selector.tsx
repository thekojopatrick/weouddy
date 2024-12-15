'use client';

import * as React from 'react';

import { Check, ChevronsUpDown } from 'lucide-react';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';

import { Button } from '@/components/ui/button';
import ReactCountryFlag from 'react-country-flag';
import { cn } from '@/lib/utils';

// Strongly typed country interface
interface Country {
	label: string;
	value: string;
}

// Predefined list of countries with proper typing
const COUNTRIES: readonly Country[] = [
	{ label: 'Ghana', value: 'GH' },
	{ label: 'United States', value: 'US' },
	{ label: 'United Kingdom', value: 'GB' },
	{ label: 'Canada', value: 'CA' },
	{ label: 'Australia', value: 'AU' },
	{ label: 'Germany', value: 'DE' },
	{ label: 'France', value: 'FR' },
	{ label: 'Japan', value: 'JP' },
	{ label: 'Brazil', value: 'BR' },
	{ label: 'India', value: 'IN' },
] as const;

// Default country (can be passed as a prop)
const DEFAULT_COUNTRY = 'GH';

interface CountrySelectorProps {
	// Optional prop to control the selected country from outside
	selectedCountry?: string;
	// Optional callback when a country is selected
	onCountryChange?: (countryCode: string) => void;
	// Optional custom styling
	className?: string;
}

export function CountrySelector({
	selectedCountry = DEFAULT_COUNTRY,
	onCountryChange,
	className,
}: CountrySelectorProps) {
	// State for controlling the popover and selected country
	const [open, setOpen] = React.useState(false);
	const [value, setValue] = React.useState(selectedCountry);

	// Effect to notify parent component of country change
	React.useEffect(() => {
		onCountryChange?.(value);
	}, [value, onCountryChange]);

	// Memoized filtered countries for performance
	const filteredCountries = React.useMemo(
		() =>
			COUNTRIES?.filter(
				(country) =>
					country.label.toLowerCase().includes(value.toLowerCase()) ||
					country.value.toLowerCase().includes(value.toLowerCase())
			),
		[value]
	);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant='ghost'
					role='combobox'
					aria-expanded={open}
					className={cn('w-[50px] justify-between px-1 ', className)}
				>
					<ReactCountryFlag
						countryCode={value}
						svg
						style={{
							width: '2em',
							height: '2em',
						}}
					/>

					<ChevronsUpDown className='h-4 w-4 shrink-0 opacity-50' />
				</Button>
			</PopoverTrigger>
			<PopoverContent className='w-[200px] p-0'>
				<Command>
					<CommandInput
						placeholder='Search country...'
						value={value}
						onValueChange={setValue}
					/>
					<CommandList>
						<CommandEmpty>No country found.</CommandEmpty>
						<CommandGroup>
							{filteredCountries?.map((country) => (
								<CommandItem
									key={country.value}
									value={country.value}
									onSelect={(currentValue) => {
										// If selecting the same country, reset, otherwise set new value
										setValue(currentValue === value ? '' : currentValue);
										setOpen(false);
									}}
								>
									<Check
										className={cn(
											'mr-2 h-4 w-4',
											value === country.value ? 'opacity-100' : 'opacity-0'
										)}
									/>
									<ReactCountryFlag
										countryCode={country.value}
										svg
										style={{
											width: '1em',
											height: '1em',
											marginRight: '0.5em',
										}}
									/>
									{country.label}
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
