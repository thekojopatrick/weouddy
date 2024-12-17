'use client';

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import {
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
} from '@/components/ui/drawer';
import { ImagePlus, Loader2, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { FileWithPreview } from '@/types/upload';
import Image from 'next/image';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { useUploadFiles } from '../hooks/use-upload-files';

interface CreatePostModalProps {
	open: boolean;
	onOpenChangeAction: (open: boolean) => void;
}

export function CreatePostModal({
	open,
	onOpenChangeAction,
}: CreatePostModalProps) {
	const [isMobile, setIsMobile] = useState(false);
	const { uploadState, handleFiles, uploadFiles, removeFile } =
		useUploadFiles();
	const [content, setContent] = useState('');

	useEffect(() => {
		const checkMobile = () => setIsMobile(window.innerWidth < 768);
		checkMobile();
		window.addEventListener('resize', checkMobile);
		return () => window.removeEventListener('resize', checkMobile);
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (uploadState.isUploading) return;

		const paths = await uploadFiles();
		// Here you would typically save the post with content and file paths
		console.log('Uploaded files:', paths);
		console.log('Post content:', content);
		onOpenChangeAction(false);
	};

	const Wrapper = isMobile ? Drawer : Dialog;
	const WrapperContent = isMobile ? DrawerContent : DialogContent;
	const HeaderWrapper = isMobile ? DrawerHeader : DialogHeader;
	const TitleWrapper = isMobile ? DrawerTitle : DialogTitle;

	return (
		<Wrapper open={open} onOpenChange={onOpenChangeAction}>
			<WrapperContent className='sm:max-w-[425px]'>
				<HeaderWrapper>
					<TitleWrapper>Create Post</TitleWrapper>
				</HeaderWrapper>
				<form onSubmit={handleSubmit} className='space-y-4'>
					<Textarea
						placeholder="What's happening?"
						value={content}
						onChange={(e) => setContent(e.target.value)}
						className='min-h-[100px]'
					/>

					{uploadState.files.length > 0 && (
						<div className='space-y-2'>
							<Progress value={uploadState.totalProgress} className='h-2' />
							<div className='flex flex-wrap gap-2'>
								{uploadState.files.map(
									(file: FileWithPreview, index: number) => (
										<div
											key={index}
											className='relative aspect-square h-24 w-24'
										>
											<Image
												src={file.preview}
												alt='Upload preview'
												className='rounded-lg object-cover'
												fill
											/>
											<div className='absolute inset-0 bg-black/10 rounded-lg flex items-center justify-center'>
												{file.uploading ? (
													<div className='text-white text-sm'>
														{Math.round(file.progress)}%
													</div>
												) : file.error ? (
													<div className='text-red-500 text-sm'>Error</div>
												) : null}
											</div>
											<Button
												type='button'
												variant='destructive'
												size='icon'
												className='absolute top-1 right-1 h-8 w-8'
												onClick={() => removeFile(index)}
											>
												<Trash2 className='h-4 w-4' />
											</Button>
										</div>
									)
								)}
							</div>
						</div>
					)}

					<div className='flex justify-between items-center'>
						<div className='flex gap-2'>
							<Button
								type='button'
								variant='outline'
								size='icon'
								onClick={() => {
									const input = document.createElement('input');
									input.type = 'file';
									input.multiple = true;
									input.accept = 'image/*,video/*';
									input.onchange = (e) =>
										handleFiles((e.target as HTMLInputElement).files);
									input.click();
								}}
								disabled={uploadState.files.length >= 5}
							>
								<ImagePlus className='h-4 w-4' />
							</Button>
							{uploadState.files.length >= 5 && (
								<span className='text-xs text-muted-foreground'>
									Maximum 5 files allowed
								</span>
							)}
						</div>
						<Button type='submit' disabled={uploadState.isUploading}>
							{uploadState.isUploading ? (
								<>
									<Loader2 className='mr-2 h-4 w-4 animate-spin' />
									Uploading...
								</>
							) : (
								'Post'
							)}
						</Button>
					</div>
				</form>
			</WrapperContent>
		</Wrapper>
	);
}
