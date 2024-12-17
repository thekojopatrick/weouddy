'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

import { AspectRatio } from '@/components/ui/aspect-ratio';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface PostMediaSliderProps {
	media: Array<{
		id: string;
		url: string;
		type: 'IMAGE' | 'VIDEO';
	}>;
	alt?: string;
}

export function PostMediaSlider({ media, alt = '' }: PostMediaSliderProps) {
	const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

	// No slider needed if only one media item
	if (media.length === 0) return null;

	const handleNext = () => {
		setCurrentMediaIndex((prev) => (prev + 1) % media.length);
	};

	const handlePrev = () => {
		setCurrentMediaIndex((prev) => (prev - 1 + media.length) % media.length);
	};

	const currentMedia = media[currentMediaIndex];

	console.log(media, currentMedia);

	return (
		<div className='relative w-full'>
			<AspectRatio ratio={1}>
				{currentMedia.type === 'IMAGE' ? (
					<Image
						src={currentMedia.url}
						alt={alt}
						fill
						className='object-cover rounded-lg'
					/>
				) : (
					<video
						src={currentMedia.url}
						controls
						className='w-full h-full object-cover rounded-lg'
					/>
				)}
			</AspectRatio>

			{/* Slider controls - only show if more than one media item */}
			{media.length > 1 && (
				<>
					{/* Previous button */}
					<button
						onClick={handlePrev}
						className='absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition-colors z-50'
					>
						<ChevronLeft className='h-6 w-6' />
					</button>

					{/* Next button */}
					<button
						onClick={handleNext}
						className='absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition-colors z-50'
					>
						<ChevronRight className='h-6 w-6' />
					</button>

					{/* Media indicator */}
					<div className='absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2'>
						{media.map((_, index) => (
							<div
								key={index}
								className={cn(
									'h-2 w-2 rounded-full',
									index === currentMediaIndex ? 'bg-white' : 'bg-white/50'
								)}
							/>
						))}
					</div>
				</>
			)}
		</div>
	);
}
