'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';

export default function AuthCodeErrorPage() {
	const searchParams = useSearchParams();
	const router = useRouter();

	// Get the error message from URL parameters
	const errorMessage = searchParams.get('error') || 'Authentication failed';

	const handleRetry = () => {
		// Redirect back to login page
		router.push('/auth');
	};

	return (
		<div className='flex items-center justify-center min-h-screen bg-gray-100'>
			<Card className='w-full max-w-md'>
				<CardHeader>
					<CardTitle className='text-center text-red-600'>
						Authentication Error
					</CardTitle>
				</CardHeader>
				<CardContent className='space-y-4'>
					<div className='text-center'>
						<p className='text-gray-700 mb-4'>
							We encountered an issue during the authentication process.
						</p>
						<p className='text-sm text-gray-500 mb-4'>
							Error details: {errorMessage}
						</p>
					</div>

					<div className='flex flex-col space-y-2'>
						<Button onClick={handleRetry} className='w-full'>
							Try Again
						</Button>
						<Button
							variant='outline'
							onClick={() => router.push('/')}
							className='w-full'
						>
							Return to Home
						</Button>
					</div>

					<div className='text-center text-xs text-gray-500 mt-4'>
						<p>
							If the problem persists, please contact support.
							<Link href={'/contact'}>Contact us</Link>
						</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
