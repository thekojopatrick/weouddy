'use client';

import { ImageGrid } from '@/components/image-grid';
import { ImageUpload } from '@/components/image-upload';
import { ProgressBar } from '@/components/progress-bar';
import { useState } from 'react';

export default function PhotoAlbum() {
	const [images, setImages] = useState<{ url: string; progress: number }[]>([]);
	const [uploadProgress, setUploadProgress] = useState({
		current: 0,
		total: 0,
	});

	const handleUpload = async (files: File[]) => {
		const newImages = files.map((file) => ({
			url: URL.createObjectURL(file),
			progress: 0,
		}));

		setImages((prev) => [...prev, ...newImages]);
		setUploadProgress({ current: 0, total: files.length });

		// Simulate upload progress
		for (let i = 0; i < files.length; i++) {
			for (let progress = 0; progress <= 100; progress += 10) {
				await new Promise((resolve) => setTimeout(resolve, 200));
				setImages((prev) =>
					prev.map((img, index) =>
						index === prev.length - files.length + i
							? { ...img, progress }
							: img
					)
				);
			}
			setUploadProgress((prev) => ({
				...prev,
				current: prev.current + 1,
			}));
		}
	};

	return (
		<div className='max-w-6xl mx-auto p-6'>
			<h1 className='text-3xl font-bold mb-6'>Album Photos</h1>
			{uploadProgress.total > 0 &&
				uploadProgress.current < uploadProgress.total && (
					<ProgressBar
						current={uploadProgress.current}
						total={uploadProgress.total}
						estimatedTime={`${uploadProgress.total - uploadProgress.current}m ${Math.floor(Math.random() * 60)}s`}
					/>
				)}
			<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
				<ImageUpload onUploadAction={handleUpload} />
				<ImageGrid images={images} />
			</div>
		</div>
	);
}
