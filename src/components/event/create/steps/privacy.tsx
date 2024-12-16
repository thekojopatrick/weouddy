import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
} from '@/components/ui/form';

import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

interface PrivacyStepProps {
	onSubmit: () => void;
	onBack: () => void;
	isSubmitting: boolean;
}

export function PrivacyStep({
	onSubmit,
	onBack,
	isSubmitting,
}: PrivacyStepProps) {
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

			<FormField
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
							<Switch checked={field.value} onCheckedChange={field.onChange} />
						</FormControl>
					</FormItem>
				)}
			/>

			<div className='flex justify-between'>
				<Button
					type='button'
					variant='ghost'
					onClick={onBack}
					disabled={isSubmitting}
				>
					Back
				</Button>
				<Button type='submit' onClick={onSubmit} disabled={isSubmitting}>
					Finish
				</Button>
			</div>
		</div>
	);
}
