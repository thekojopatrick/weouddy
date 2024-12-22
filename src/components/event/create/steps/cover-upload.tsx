'use client';

import {
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from '@/components/ui/form';
import { ImagePlus, X } from 'lucide-react';
import { useCallback, useState } from 'react';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import { useFormContext } from 'react-hook-form';

interface CoverUploadStepProps {
	onNextAction: () => void;
	onBackAction: () => void;
}

export function CoverUploadStep({
	onNextAction,
	onBackAction,
}: CoverUploadStepProps) {
	const { setValue, watch } = useFormContext();
	const coverImage = watch('coverImage');
	const [previewImage, setPreviewImage] = useState<string | null>(coverImage);

	const onDrop = useCallback(
		(acceptedFiles: File[]) => {
			const file = acceptedFiles[0];
			if (file) {
				const reader = new FileReader();
				reader.onload = () => {
					const imageDataUrl = reader.result as string;
					setPreviewImage(imageDataUrl);
					setValue('coverImage', imageDataUrl);
				};
				reader.readAsDataURL(file);
			}
		},
		[setValue]
	);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: {
			'image/*': ['.jpeg', '.png', '.gif', '.jpg', '.webp'],
		},
		multiple: false,
	});

	const handleRemoveImage = () => {
		setPreviewImage(null);
		setValue('coverImage', null);
	};

	return (
		<div className='space-y-6 py-6'>
			<div className='space-y-2'>
				<h2 className='text-xl font-bold tracking-tight'>Upload Cover</h2>
				<p className='text-muted-foreground text-sm'>
					Turn your gathering into a celebration and let your world shine.
				</p>
			</div>

			<FormField
				name='coverImage'
				render={({}) => (
					<FormItem>
						<FormControl>
							<div className='flex flex-col items-center gap-4'>
								<div
									{...getRootProps()}
									className={`relative aspect-video w-full overflow-hidden rounded-lg border ${
										isDragActive
											? 'border-primary bg-primary/10'
											: 'border-dashed'
									} cursor-pointer`}
								>
									<input {...getInputProps()} />
									{previewImage ? (
										<>
											<Image
												src={previewImage}
												alt='Cover'
												fill
												className='object-cover'
											/>
											<Button
												type='button'
												variant='destructive'
												size='icon'
												className='absolute top-2 right-2 z-10 rounded-full'
												onClick={(e) => {
													e.stopPropagation();
													handleRemoveImage();
												}}
											>
												<X className='h-4 w-4' />
											</Button>
										</>
									) : (
										<div className='flex h-full flex-col items-center justify-center gap-2'>
											<ImagePlus className='h-8 w-8 text-muted-foreground' />
											<span className='text-sm text-muted-foreground'>
												{isDragActive
													? 'Drop image here'
													: 'Drag and drop or click to upload'}
											</span>
										</div>
									)}
								</div>
								{!previewImage && (
									<Button
										type='button'
										variant='outline'
										onClick={() => {
											// Trigger file input
											const input = document.createElement('input');
											input.type = 'file';
											input.accept = 'image/*';
											input.onchange = (e) => {
												const target = e.target as HTMLInputElement;
												const file = target.files?.[0];
												if (file) {
													const reader = new FileReader();
													reader.onload = () => {
														const imageDataUrl = reader.result as string;
														setPreviewImage(imageDataUrl);
														setValue('coverImage', imageDataUrl);
													};
													reader.readAsDataURL(file);
												}
											};
											input.click();
										}}
									>
										Choose Image
									</Button>
								)}
							</div>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<div className='flex justify-between'>
				<Button
					type='button'
					variant='outline'
					onClick={onBackAction}
					className='rounded-full shadow-none'
				>
					Back
				</Button>
				<Button
					type='button'
					onClick={onNextAction}
					disabled={!previewImage}
					className='rounded-full'
				>
					Next
				</Button>
			</div>
		</div>
	);
}
