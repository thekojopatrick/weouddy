'use client';

import {
	ChevronLeft,
	ChevronRight,
	Pause,
	Play,
	Volume2,
	VolumeX,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { AspectRatio } from '@/components/ui/aspect-ratio';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface PostMediaSliderProps {
	media: Array<{
		id: string;
		url: string;
		type: 'IMAGE' | 'VIDEO';
	}>;
	alt?: string;
	isHovered: boolean;
}

export function PostMediaSlider({
	media,
	alt = '',
	isHovered,
}: PostMediaSliderProps) {
	const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
	const [isPlaying, setIsPlaying] = useState(false);
	const [isMuted, setIsMuted] = useState(false);
	const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

	// Reset refs when media changes
	useEffect(() => {
		videoRefs.current = media.map(() => null);
	}, [media]);

	// Manage video playback when media or hover state changes
	useEffect(() => {
		const currentVideo = videoRefs.current[currentMediaIndex];

		if (
			isHovered &&
			currentVideo &&
			media[currentMediaIndex].type === 'VIDEO'
		) {
			// Reset all videos
			videoRefs.current.forEach((video) => {
				if (video) {
					video.pause();
					video.currentTime = 0;
					video.muted = isMuted;
				}
			});

			// Play current video
			currentVideo.play().catch((error) => {
				console.error('Autoplay was prevented:', error);
			});

			setIsPlaying(true);
		} else {
			// Stop all videos when not hovered
			if (currentVideo) {
				currentVideo.pause();
				currentVideo.currentTime = 0;
			}

			setIsPlaying(false);
		}
	}, [isHovered, currentMediaIndex, media, isMuted]);

	const handleNext = () => {
		setCurrentMediaIndex((prev) => (prev + 1) % media.length);
	};

	const handlePrev = () => {
		setCurrentMediaIndex((prev) => (prev - 1 + media.length) % media.length);
	};

	const togglePlayPause = () => {
		//setIsHovered((prev) => !prev);
	};

	const toggleMute = () => {
		setIsMuted((prev) => !prev);

		// Apply mute/unmute to current video
		const currentVideo = videoRefs.current[currentMediaIndex];
		if (currentVideo && media[currentMediaIndex].type === 'VIDEO') {
			currentVideo.muted = !isMuted;
		}
	};

	const currentMedia = media[currentMediaIndex];

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
						ref={(el) => {
							if (videoRefs.current) {
								videoRefs.current[currentMediaIndex] = el;
							}
						}}
						src={currentMedia.url}
						className='w-full h-full object-cover rounded-lg'
						muted={isMuted}
						playsInline
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
						className='absolute right-2 top-1/2 -translate-y-1/2  bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition-colors z-50'
					>
						<ChevronRight className='h-6 w-6' />
					</button>

					{/* Play/Pause button */}
					{isHovered && currentMedia.type === 'VIDEO' && (
						<div className='absolute bottom-2 right-2 flex space-x-2'>
							<button
								onClick={togglePlayPause}
								className='bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition-colors z-50'
							>
								{isPlaying ? (
									<Pause className='h-5 w-5' />
								) : (
									<Play className='h-5 w-5' />
								)}
							</button>

							{/* Mute/Unmute button */}
							{currentMedia.type === 'VIDEO' && (
								<button
									onClick={toggleMute}
									className='bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition-colors z-50'
								>
									{isMuted ? (
										<VolumeX className='h-5 w-5' />
									) : (
										<Volume2 className='h-5 w-5' />
									)}
								</button>
							)}
						</div>
					)}

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
