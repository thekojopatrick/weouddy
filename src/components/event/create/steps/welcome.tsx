import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';

interface WelcomeStepProps {
	onNext: () => void;
	onSkip: () => void;
}

export function WelcomeStep({ onNext, onSkip }: WelcomeStepProps) {
	return (
		<div className='space-y-6 py-6'>
			<div className='space-y-2 text-center'>
				<h2 className='text-2xl font-bold tracking-tight'>
					Create & Host Your Event, Your Way!
				</h2>
				<p className='text-muted-foreground'>
					Create an event in just a few clicks. Whether it&apos;s for close
					friends or a public audience, make it memorable by sharing the details
					instantly
				</p>
			</div>

			<div className='flex justify-center py-8'>
				<div className='relative'>
					<div className='absolute inset-0 flex items-center justify-center'>
						<div className='h-32 w-32 rounded-full border-2 border-dashed border-primary/50' />
					</div>
					<div className='relative flex items-center justify-center h-32 w-32'>
						<Calendar className='h-12 w-12 text-primary' />
					</div>
					<div className='absolute top-0 -right-16'>
						<div className='h-12 w-12 rounded-full bg-blue-500 border-4 border-background' />
					</div>
					<div className='absolute bottom-0 -right-8'>
						<div className='h-12 w-12 rounded-full bg-green-500 border-4 border-background' />
					</div>
					<div className='absolute top-1/2 -right-4'>
						<div className='h-12 w-12 rounded-full bg-red-500 border-4 border-background' />
					</div>
					<div className='absolute bottom-1/2 -right-12'>
						<div className='h-12 w-12 rounded-full bg-yellow-500 border-4 border-background' />
					</div>
				</div>
			</div>

			<div className='flex justify-between'>
				<Button variant='ghost' onClick={onSkip}>
					Skip
				</Button>
				<Button onClick={onNext}>Let&apos;s start</Button>
			</div>
		</div>
	);
}
