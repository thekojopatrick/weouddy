import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface WelcomeStepProps {
	onNext: () => void;
	onSkip: () => void;
}

export function WelcomeStep({ onNext, onSkip }: WelcomeStepProps) {
	return (
		<div className='space-y-6 py-6'>
			<div className='space-y-2 text-center'>
				<h2 className='text-2xl font-bold tracking-tight'>
					Create & host your event, your way!
				</h2>
				<p className='text-muted-foreground'>
					Create an event in just a few clicks. Whether it&apos;s for close
					friends or a public audience, make it memorable by sharing the details
					instantly
				</p>
			</div>

			<div className='flex justify-center py-8'>
				<Image
					src={'/illustration/event-people.svg'}
					className='object-cover max-h-96 max-w-96'
					alt='Event illustration'
					width={300}
					height={200}
				/>
			</div>

			<div className='flex justify-between'>
				<Button variant='outline' className='rounded-full' onClick={onSkip}>
					Skip
				</Button>
				<Button className='rounded-full' onClick={onNext}>
					Let&apos;s start
				</Button>
			</div>
		</div>
	);
}
