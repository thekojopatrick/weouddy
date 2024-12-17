import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export function EmptyEvents() {
	return (
		<div className='container mx-auto px-4 py-12'>
			<div className='text-center'>
				<h2 className='text-xl font-semibold mb-2'>No events yet</h2>
				<p className='text-muted-foreground mb-6'>
					You have no public events yet. Once you make collections public,
					they&apos;ll show up here
				</p>
				<div className='flex flex-wrap justify-center gap-2'>
					<Button>
						<Plus className='w-4 h-4 mr-2' />
						Create Event
					</Button>
					<Button variant='secondary'>
						<Plus className='w-4 h-4 mr-2' />
						Join Event
					</Button>
				</div>
			</div>
		</div>
	);
}
