import { EventFormValues, eventDetailsSchema } from '@/types/validation';
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

const eventTypes = [
	'Birthday',
	'Wedding',
	'Conference',
	'Party',
	'Meeting',
	'Other',
];

interface EventDetailsStepProps {
	form: UseFormReturn<EventFormValues>;
	onSubmit: (values: z.infer<typeof eventDetailsSchema>) => void;
	onBack: () => void;
}

export function EventDetailsStep({
	form,
	onSubmit,
	onBack,
}: EventDetailsStepProps) {
	const handleNext = (data: EventFormValues) => {
		console.log({ data });

		// If form validation passes, move to next step
		onSubmit(data);
	};
	return (
		<div className='space-y-6 py-6'>
			<div className='space-y-2'>
				<h2 className='text-2xl font-bold tracking-tight'>
					Enter Event or Room Details
				</h2>
				<p className='text-muted-foreground'>
					Big or small, your event, your room deserves the spotlight. Share your
					vibe, your way!
				</p>
			</div>

			<>
				<div className='space-y-6'>
					<FormField
						control={form.control}
						name='title'
						render={({ field }) => (
							<FormItem>
								<FormLabel>What&apos;s the title of your event?</FormLabel>
								<FormControl>
									<Input placeholder='E.g., Summer BBQ Bash' {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='type'
						render={({ field }) => (
							<FormItem>
								<FormLabel>
									Choose the type of event you&apos;re planning
								</FormLabel>
								<Select
									onValueChange={field.onChange}
									defaultValue={field.value}
								>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder='Select event type' />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{eventTypes.map((type) => (
											<SelectItem key={type} value={type.toLowerCase()}>
												{type}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='description'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Tell us a little about your event</FormLabel>
								<FormControl>
									<Textarea
										placeholder='Enter event description'
										className='min-h-[100px]'
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div className='flex justify-between'>
						<Button type='button' variant='ghost' onClick={onBack}>
							Back
						</Button>
						<Button onClick={() => handleNext}>Next</Button>
					</div>
				</div>
			</>
		</div>
	);
}
