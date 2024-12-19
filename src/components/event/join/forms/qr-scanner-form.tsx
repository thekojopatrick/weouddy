'use client';

import { ArrowLeft, QrCode } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface QRScannerFormProps {
	onScanCompleteAction: (result: string) => void;
	onBackAction: () => void;
}

export function QRScannerForm({
	onScanCompleteAction,
	onBackAction,
}: QRScannerFormProps) {
	const [isScanning, setIsScanning] = useState(false);

	// Simulated QR scanning - in real app, use a proper QR scanner library
	const startScanning = () => {
		setIsScanning(true);
		// Simulate successful scan after 2 seconds
		setTimeout(() => {
			setIsScanning(false);
			onScanCompleteAction('weouddy.com/event/birthday_party');
		}, 2000);
	};

	return (
		<div className='space-y-6'>
			<Button variant='ghost' size='sm' onClick={onBackAction} className='mb-2'>
				<ArrowLeft className='mr-2 h-4 w-4' />
				Back
			</Button>

			<div className='aspect-square w-full bg-muted rounded-lg flex items-center justify-center'>
				{isScanning ? (
					<div className='text-center space-y-4'>
						<QrCode className='h-12 w-12 animate-pulse mx-auto' />
						<p className='text-sm text-muted-foreground'>Scanning...</p>
					</div>
				) : (
					<Button onClick={startScanning}>
						<QrCode className='mr-2 h-4 w-4' />
						Start Scanning
					</Button>
				)}
			</div>
		</div>
	);
}
