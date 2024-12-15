'use client';

import { CalendarIcon, Clock, MapPin } from 'lucide-react';
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Time, parseTime } from '@internationalized/date';
import { addDays, format, subDays } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { LocationModal } from '@/components/location/location-modal';
import { cn } from '@/lib/utils';
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
	const { setValue, watch } = useFormContext();
	const timeValue = watch('time');

	const handleTimeQuickSelect = (quickTime: string) => {
		const now = new Date();
		switch (quickTime) {
			case 'now':
				setValue('date', now.toISOString());
				setValue('time', format(now, 'HH:mm'));
				break;
			case 'today':
				setValue('date', now.toISOString());
				break;
			case 'tomorrow':
				const tomorrow = addDays(now, 1);
				setValue('date', tomorrow.toISOString());
				break;
			case 'yesterday':
				const yesterday = subDays(now, 1);
				setValue('date', yesterday.toISOString());
				break;
		}
	};

	const handleTimeChange = (time: Time | null) => {
		if (time) {
			const formattedTime = `${time.hour.toString().padStart(2, '0')}:${time.minute.toString().padStart(2, '0')}`;
			setValue('time', formattedTime);
		}
	};

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
								className='w-full justify-start truncate '
								onClick={() => setShowLocationModal(true)}
							>
								<MapPin className='mr-1 h-4 w-4' />
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
						<div className='flex space-x-2'>
							<Popover>
								<PopoverTrigger asChild>
									<FormControl className='flex-grow'>
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
							<Select onValueChange={handleTimeQuickSelect}>
								<SelectTrigger className='w-[120px]'>
									<SelectValue placeholder='Quick Date' />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='now'>Now</SelectItem>
									<SelectItem value='today'>Today</SelectItem>
									<SelectItem value='tomorrow'>Tomorrow</SelectItem>
									<SelectItem value='yesterday'>Yesterday</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				name='time'
				render={({ field }) => (
					<FormItem className='flex flex-col'>
						<FormLabel>What time is your event happening?</FormLabel>
						<div className='flex space-x-2 items-center'>
							<FormControl className='flex-grow'>
								<TimeField
									value={
										field.value
											? parseTime(field.value)
											: parseTime(format(new Date(), 'HH:mm'))
									}
									onChange={handleTimeChange}
									className='w-full'
								>
									<DateInput className='relative inline-flex h-9 w-full items-center overflow-hidden whitespace-nowrap rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm shadow-black/5 transition-shadow data-[focus-within]:border-ring data-[disabled]:opacity-50 data-[focus-within]:outline-none data-[focus-within]:ring-[3px] data-[focus-within]:ring-ring/20'>
										{(segment) => (
											<DateSegment
												segment={segment}
												className='inline rounded p-0.5 text-foreground caret-transparent outline outline-0 data-[disabled]:cursor-not-allowed data-[focused]:bg-accent data-[invalid]:data-[focused]:bg-destructive data-[type=literal]:px-0 data-[focused]:data-[placeholder]:text-foreground data-[focused]:text-foreground data-[invalid]:data-[focused]:data-[placeholder]:text-destructive-foreground data-[invalid]:data-[focused]:text-destructive-foreground data-[invalid]:data-[placeholder]:text-destructive data-[invalid]:text-destructive data-[placeholder]:text-muted-foreground/70 data-[type=literal]:text-muted-foreground/70 data-[disabled]:opacity-50'
											/>
										)}
									</DateInput>
								</TimeField>
							</FormControl>
							<Button
								type='button'
								variant='outline'
								onClick={() => handleTimeQuickSelect('now')}
							>
								<Clock className='h-4 w-4 mr-2' /> Now
							</Button>
						</div>
					</FormItem>
				)}
			/>

			<div className='flex justify-between'>
				<Button type='button' variant='ghost' onClick={onBackAction}>
					Back
				</Button>
				<Button
					type='button'
					onClick={() => {
						// Optional time handling
						if (!timeValue) {
							setValue('time', format(new Date(), 'HH:mm'));
						}
						onNextAction();
					}}
				>
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
