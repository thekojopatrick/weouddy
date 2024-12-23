'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useEffect } from 'react';

// Error boundaries must be Client Components

export default function GlobalError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		// Log the error to an error reporting service
		console.error(error);
	}, [error]);

	return (
		// global-error must include html and body tags
		<html>
			<body>
				<div className='w-full h-screen flex flex-col justify-center items-center gap-y-6'>
					<div className='space-y-4 text-center max-w-xl'>
						<h1 className='text-3xl font-bold'>Something went wrong!</h1>
						<p>Refresh the page or contact support if this problem persists</p>
					</div>
					<div className='flex gap-x-3'>
						<Button
							variant={'default'}
							className='rounded-full'
							onClick={() => () => reset()}
						>
							Let&apos;s try again
						</Button>
						<Button variant={'secondary'} className='rounded-full' asChild>
							<Link href={'/contact'}>Contact Support</Link>
						</Button>
					</div>
				</div>
			</body>
		</html>
	);
}
