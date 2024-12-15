'use client';

import { CalendarIcon, MapPin } from 'lucide-react';
import { DateInput, DateSegment, TimeField } from 'react-aria-components';
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { LocationModal } from '@/components/location/location-modal';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useFormContext } from 'react-hook-form';
import { useState } from 'react';

interface LocationTimeStepProps {
	onNextAction: () => void;
	onBackAction: () => void;
}

export function LocationTimeStep({
	onNextAction,
	onBackAction,
}: LocationTimeStepProps) {
	const [showLocationModal, setShowLocationModal] = useState(false);
	const { setValue } = useFormContext();

	return (
		<div className='space-y-6 py-6'>
			<div className='space-y-2'>
				<h2 className='text-2xl font-bold tracking-tight'>Continue</h2>
				<p className='text-muted-foreground'>
					Turn your gathering into a celebration and let your world shine.
				</p>
			</div>

			<FormField
				name='location'
				render={({ field }) => (
					<FormItem>
						<FormLabel>Where is your event taking place?</FormLabel>
						<FormControl>
							<Button
								type='button'
								variant='outline'
								className='w-full justify-start'
								onClick={() => setShowLocationModal(true)}
							>
								<MapPin className='mr-2 h-4 w-4' />
								{field.value || 'Select location'}
							</Button>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				name='date'
				render={({ field }) => (
					<FormItem className='flex flex-col'>
						<FormLabel>When is your event happening?</FormLabel>
						<Popover>
							<PopoverTrigger asChild>
								<FormControl>
									<Button
										variant={'outline'}
										className={cn(
											'w-full pl-3 text-left font-normal',
											!field.value && 'text-muted-foreground'
										)}
									>
										{field.value ? (
											format(new Date(field.value), 'PPP')
										) : (
											<span>Pick a date</span>
										)}
										<CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
									</Button>
								</FormControl>
							</PopoverTrigger>
							<PopoverContent className='w-auto p-0' align='start'>
								<Calendar
									mode='single'
									selected={field.value ? new Date(field.value) : undefined}
									onSelect={(date) => field.onChange(date?.toISOString())}
									disabled={(date) =>
										date < new Date() || date < new Date('1900-01-01')
									}
									initialFocus
								/>
							</PopoverContent>
						</Popover>
						<FormMessage />
					</FormItem>
				)}
			/>
			<FormField
				name='time'
				render={({ field }) => (
					<FormItem className='flex flex-col'>
						<FormLabel>What time is your event happening?</FormLabel>
						<FormControl>
							<TimeField className='space-y-2'>
								<DateInput
									{...field}
									className='relative inline-flex h-9 w-full items-center overflow-hidden whitespace-nowrap rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm shadow-black/5 transition-shadow data-[focus-within]:border-ring data-[disabled]:opacity-50 data-[focus-within]:outline-none data-[focus-within]:ring-[3px] data-[focus-within]:ring-ring/20'
								>
									{(segment) => (
										<DateSegment
											segment={segment}
											className='inline rounded p-0.5 text-foreground caret-transparent outline outline-0 data-[disabled]:cursor-not-allowed data-[focused]:bg-accent data-[invalid]:data-[focused]:bg-destructive data-[type=literal]:px-0 data-[focused]:data-[placeholder]:text-foreground data-[focused]:text-foreground data-[invalid]:data-[focused]:data-[placeholder]:text-destructive-foreground data-[invalid]:data-[focused]:text-destructive-foreground data-[invalid]:data-[placeholder]:text-destructive data-[invalid]:text-destructive data-[placeholder]:text-muted-foreground/70 data-[type=literal]:text-muted-foreground/70 data-[disabled]:opacity-50'
										/>
									)}
								</DateInput>
							</TimeField>
						</FormControl>
					</FormItem>
				)}
			/>

			<div className='flex justify-between'>
				<Button type='button' variant='ghost' onClick={onBackAction}>
					Back
				</Button>
				<Button type='button' onClick={onNextAction}>
					Next
				</Button>
			</div>

			<LocationModal
				open={showLocationModal}
				onOpenChange={setShowLocationModal}
				onSelectLocation={(location) => {
					setValue('location', location.address);
					console.log({ location });
				}}
			/>
		</div>
	);
}
