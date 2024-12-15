import { Download, QrCode, Share2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface SuccessStepProps {
	eventUrl: string;
	onClose: () => void;
}

export function SuccessStep({ eventUrl, onClose }: SuccessStepProps) {
	return (
		<div className='space-y-6 py-6'>
			<div className='space-y-2 text-center'>
				<h2 className='text-2xl font-bold tracking-tight'>
					Event successfully created
				</h2>
				<p className='text-muted-foreground'>
					Your event has been created successfully! Share it with your friends
					or publish it to reach a wider audience
				</p>
			</div>

			<div className='flex justify-center py-6'>
				<div className='relative h-48 w-48'>
					<Image
						src='/qr-code.svg'
						alt='Event QR Code'
						fill
						className='object-contain'
					/>
				</div>
			</div>

			<div className='space-y-4'>
				<div className='flex items-center gap-2 rounded-lg border p-2'>
					<span className='truncate flex-1 text-sm'>{eventUrl}</span>
					<Button variant='ghost' size='icon'>
						<QrCode className='h-4 w-4' />
					</Button>
				</div>

				<div className='grid gap-2'>
					<Button className='w-full'>
						<Share2 className='mr-2 h-4 w-4' />
						Share Event
					</Button>
					<Button variant='outline' className='w-full'>
						<Download className='mr-2 h-4 w-4' />
						Download QR Code
					</Button>
				</div>

				<Button variant='ghost' className='w-full' onClick={onClose}>
					Done
				</Button>
			</div>
		</div>
	);
}
