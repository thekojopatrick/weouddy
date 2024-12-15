import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
} from '@/components/ui/form';

import { Button } from '@/components/ui/button';
import { EventFormValues } from '@/types/validation';
import { Switch } from '@/components/ui/switch';
import { UseFormReturn } from 'react-hook-form';

interface PrivacyStepProps {
	form: UseFormReturn<EventFormValues>;
	onSubmit: (values: EventFormValues) => void;
	onBack: () => void;
}

export function PrivacyStep({ form, onSubmit, onBack }: PrivacyStepProps) {
	return (
		<div className='space-y-6 py-6'>
			<div className='space-y-2'>
				<h2 className='text-2xl font-bold tracking-tight'>
					Lastly, Privacy Settings
				</h2>
				<p className='text-muted-foreground'>
					Choose who can see and join your event. You can always update these
					settings later if you change your mind
				</p>
			</div>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
					<FormField
						control={form.control}
						name='isPublic'
						render={({ field }) => (
							<FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
								<div className='space-y-0.5'>
									<FormDescription>Public or Private</FormDescription>
									<FormDescription>
										By turning it on anyone can discover, view, and join your
										event/room.
									</FormDescription>
								</div>
								<FormControl>
									<Switch
										checked={field.value}
										onCheckedChange={field.onChange}
									/>
								</FormControl>
							</FormItem>
						)}
					/>

					<div className='flex justify-between'>
						<Button type='button' variant='ghost' onClick={onBack}>
							Back
						</Button>
						<Button type='submit'>Finish</Button>
					</div>
				</form>
			</Form>
		</div>
	);
}
