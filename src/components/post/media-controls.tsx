import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
	RiPauseFill,
	RiPlayFill,
	RiVolumeMuteFill,
	RiVolumeUpFill,
} from '@remixicon/react';

interface MediaControlsProps {
	mediaCount: number;
	currentIndex: number;
	isHovered: boolean;
	isPlaying: boolean;
	isMuted: boolean;
	onPrev: () => void;
	onNext: () => void;
	onPlayPause: () => void;
	onMute: () => void;
	isVideo: boolean;
}

export function MediaControls({
	mediaCount,
	currentIndex,
	isHovered,
	isPlaying,
	isMuted,
	onPrev,
	onNext,
	onPlayPause,
	onMute,
	isVideo,
}: MediaControlsProps) {
	return (
		<>
			{mediaCount > 1 && (
				<>
					<button
						onClick={onPrev}
						className='absolute left-2 top-1/2 -translate-y-1/4 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition-colors z-50'
					>
						<ChevronLeft className='h-6 w-6' />
					</button>
					<button
						onClick={onNext}
						className='absolute right-2 top-1/2 -translate-y-1/4 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition-colors z-50'
					>
						<ChevronRight className='h-6 w-6' />
					</button>

					<div className='absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2'>
						{Array.from({ length: mediaCount }).map((_, index) => (
							<div
								key={index}
								className={`h-2 w-2 rounded-full ${
									index === currentIndex ? 'bg-white' : 'bg-white/50'
								}`}
							/>
						))}
					</div>
				</>
			)}
			{isHovered && isVideo && (
				<div className='absolute bottom-2 right-2 flex space-x-2'>
					<button
						onClick={onPlayPause}
						className='bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition-colors z-50'
					>
						{isPlaying ? (
							<RiPauseFill className='size-4' />
						) : (
							<RiPlayFill className='size-4' />
						)}
					</button>
					<button
						onClick={onMute}
						className='bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition-colors z-50'
					>
						{isMuted ? (
							<RiVolumeMuteFill className='size-4' />
						) : (
							<RiVolumeUpFill className='size-4' />
						)}
					</button>
				</div>
			)}
		</>
	);
}
