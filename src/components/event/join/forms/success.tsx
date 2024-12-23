import { CheckCircle, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import React from 'react';

interface JoinEventSuccessProps {
	isLoading?: boolean;
	onManualRedirect?: () => void;
}

const JoinEventSuccess = ({
	isLoading = false,
	onManualRedirect,
}: JoinEventSuccessProps) => {
	return (
		<div className='flex flex-col items-center justify-center'>
			{isLoading ? (
				<div className='space-y-4 text-center flex flex-col justify-center items-center'>
					<Loader2 className='h-8 w-8 animate-spin text-primary' />
					<div className='space-y-1'>
						<h3 className='text-primary/80 text-sm font-medium'>
							Checking event access...
						</h3>
						<p className='text-muted-foreground text-xs'>
							This takes time,just hold for a few secs.
						</p>
					</div>
				</div>
			) : (
				<>
					<CheckCircle className='h-6 w-6 text-green-500' />
					<div className='text-center space-y-2'>
						<h3 className='font-semibold text-sm text-green-500'>
							Successfully Joined!
						</h3>
						<p className='text-muted-foreground text-sm'>
							You&apos;ll be redirected to the event room shortly
						</p>
					</div>
					<Button onClick={onManualRedirect} className='mt-4'>
						Go to Event Room
					</Button>
				</>
			)}
		</div>
	);
};

export default JoinEventSuccess;
