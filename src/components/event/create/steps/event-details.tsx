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

const eventTypes = [
	'Birthday',
	'Wedding',
	'Conference',
	'Party',
	'Meeting',
	'Other',
];

interface EventDetailsStepProps {
	onNext: () => void;
	onBack: () => void;
}

export function EventDetailsStep({ onNext, onBack }: EventDetailsStepProps) {
	return (
		<div className='space-y-6 py-6'>
			<div className='space-y-2'>
				<h2 className='text-xl font-bold tracking-tight'>
					Enter Event or Room Details
				</h2>
				<p className='text-muted-foreground text-sm'>
					Big or small, your event, your room deserves the spotlight. Share your
					vibe, your way!
				</p>
			</div>

			<FormField
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
				name='type'
				render={({ field }) => (
					<FormItem>
						<FormLabel>Choose the type of event you&apos;re planning</FormLabel>
						<Select onValueChange={field.onChange} defaultValue={field.value}>
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
				<Button
					type='button'
					variant='outline'
					onClick={onBack}
					className='rounded-full shadow-none'
				>
					Back
				</Button>
				<Button type='button' onClick={onNext} className='rounded-full'>
					Next
				</Button>
			</div>
		</div>
	);
}
