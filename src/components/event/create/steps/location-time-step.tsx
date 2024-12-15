'use client';

import { CalendarIcon, MapPin } from 'lucide-react';
import {
	Form,
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
import { EventFormValues } from '@/types/validation';
import { LocationModal } from '@/components/location/location-modal';
import { UseFormReturn } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useState } from 'react';

interface LocationTimeStepProps {
	form: UseFormReturn<EventFormValues>;
	onNext: () => void;
	onBack: () => void;
}

export function LocationTimeStep({
	form,
	onNext,
	onBack,
}: LocationTimeStepProps) {
	const [showLocationModal, setShowLocationModal] = useState(false);

	return (
		<div className='space-y-6 py-6'>
			<div className='space-y-2'>
				<h2 className='text-2xl font-bold tracking-tight'>Continue</h2>
				<p className='text-muted-foreground'>
					Turn your gathering into a celebration and let your world shine.
				</p>
			</div>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onNext)} className='space-y-6'>
					<FormField
						control={form.control}
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
						control={form.control}
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

					<div className='flex justify-between'>
						<Button type='button' variant='ghost' onClick={onBack}>
							Back
						</Button>
						<Button type='submit'>Next</Button>
					</div>
				</form>
			</Form>

			<LocationModal
				open={showLocationModal}
				onOpenChange={setShowLocationModal}
				onSelectLocation={(location) => {
					form.setValue('location', location.address);
				}}
			/>
		</div>
	);
}
