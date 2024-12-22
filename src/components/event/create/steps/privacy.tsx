import { Button, LoadingButton } from '@/components/ui/button';
import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
} from '@/components/ui/form';

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
				<h2 className='text-xl font-bold tracking-tight'>
					Lastly, Privacy Settings
				</h2>
				<p className='text-muted-foreground text-sm'>
					Choose who can see and join your event. You can always update these
					settings later if you change your mind
				</p>
			</div>

			<FormField
				name='isPublic'
				render={({ field }) => (
					<FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
						<div className='space-y-0.5'>
							<FormDescription>Public</FormDescription>
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
					variant='outline'
					onClick={onBack}
					disabled={isSubmitting}
					className='rounded-full shadow-none'
				>
					Back
				</Button>
				<LoadingButton
					type='submit'
					onClick={onSubmit}
					disabled={isSubmitting}
					loading={isSubmitting}
					className='rounded-full'
				>
					{isSubmitting ? 'Creating..' : 'Finish'}
				</LoadingButton>
			</div>
		</div>
	);
}
