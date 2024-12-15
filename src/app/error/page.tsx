import { Button } from '@/components/ui/button';
import React from 'react';

const ErrorPage = () => {
	return (
		<div>
			<h1>Sorry,Something went wrong</h1>
			<p>Refresh the page or contact support if this problem persists</p>
			<div className='flex gap-x-3'>
				<Button variant={'default'} onClick={() => window.location.reload()}>
					Let&apos;s Refresh
				</Button>
				<Button variant={'secondary'}>Contact Support</Button>
			</div>
		</div>
	);
};

export default ErrorPage;
