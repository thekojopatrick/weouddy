'use client';

import { Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { useRef, useState } from 'react';

import { Button } from '@/components/ui/button';

interface CustomVideoPlayerProps {
	src: string;
}

export function CustomVideoPlayer({ src }: CustomVideoPlayerProps) {
	const videoRef = useRef<HTMLVideoElement>(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [isMuted, setIsMuted] = useState(false);

	const togglePlay = () => {
		if (videoRef.current) {
			if (isPlaying) {
				videoRef.current.pause();
			} else {
				videoRef.current.play();
			}
			setIsPlaying(!isPlaying);
		}
	};

	const toggleMute = () => {
		if (videoRef.current) {
			videoRef.current.muted = !isMuted;
			setIsMuted(!isMuted);
		}
	};

	return (
		<div className='relative'>
			<video
				ref={videoRef}
				src={src}
				className='w-full h-full object-cover'
				loop
				playsInline
				controls={false}
			/>
			<div className='absolute bottom-4 left-4 flex gap-2'>
				<Button
					size='icon'
					variant='secondary'
					className='bg-black/50 hover:bg-black/70'
					onClick={togglePlay}
				>
					{isPlaying ? (
						<Pause className='h-4 w-4 text-white' />
					) : (
						<Play className='h-4 w-4 text-white' />
					)}
				</Button>
				<Button
					size='icon'
					variant='secondary'
					className='bg-black/50 hover:bg-black/70'
					onClick={toggleMute}
				>
					{isMuted ? (
						<VolumeX className='h-4 w-4 text-white' />
					) : (
						<Volume2 className='h-4 w-4 text-white' />
					)}
				</Button>
			</div>
		</div>
	);
}
