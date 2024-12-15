import {
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from '@/components/ui/form';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { ImagePlus } from 'lucide-react';

interface CoverUploadStepProps {
	onNext: () => void;
	onBack: () => void;
}

export function CoverUploadStep({ onNext, onBack }: CoverUploadStepProps) {
	return (
		<div className='space-y-6 py-6'>
			<div className='space-y-2'>
				<h2 className='text-2xl font-bold tracking-tight'>Upload Cover</h2>
				<p className='text-muted-foreground'>
					Turn your gathering into a celebration and let your world shine.
				</p>
			</div>

			<FormField
				name='coverImage'
				render={({ field }) => (
					<FormItem>
						<FormControl>
							<div className='flex flex-col items-center gap-4'>
								<div className='relative aspect-video w-full overflow-hidden rounded-lg border border-dashed'>
									{field.value ? (
										<Image
											src={field.value}
											alt='Cover'
											fill
											className='object-cover'
										/>
									) : (
										<div className='flex h-full flex-col items-center justify-center gap-2'>
											<ImagePlus className='h-8 w-8 text-muted-foreground' />
											<span className='text-sm text-muted-foreground'>
												Add cover image
											</span>
										</div>
									)}
								</div>
								<Button
									type='button'
									variant='outline'
									onClick={() => {
										// Handle image upload
										field.onChange('/placeholder.svg');
									}}
								>
									Choose Image
								</Button>
							</div>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<div className='flex justify-between'>
				<Button type='button' variant='ghost' onClick={onBack}>
					Back
				</Button>
				<Button type='button' onClick={onNext}>
					Next
				</Button>
			</div>
		</div>
	);
}
