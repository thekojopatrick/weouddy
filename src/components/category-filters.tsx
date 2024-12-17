'use client';

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

import { Button } from '@/components/ui/button';
import { SlidersHorizontal } from 'lucide-react';

interface CategoryFiltersProps {
	onCategoryChangeAction: (category: string) => void;
	currentCategory: string;
	categories: string[];
}

export function CategoryFilters({
	onCategoryChangeAction,
	currentCategory,
	categories,
}: CategoryFiltersProps) {
	return (
		<div className='flex items-center justify-between py-4'>
			<ScrollArea className='w-full whitespace-nowrap'>
				<div className='flex space-x-2'>
					{categories.map((category) => (
						<Button
							key={category}
							variant={currentCategory === category ? 'default' : 'secondary'}
							className='rounded-full capitalize'
							onClick={() => onCategoryChangeAction(category)}
						>
							{category}
						</Button>
					))}
				</div>
				<ScrollBar orientation='horizontal' />
			</ScrollArea>
			<Button variant='outline' size='icon' className='ml-4 shrink-0'>
				<SlidersHorizontal className='h-4 w-4' />
				<span className='sr-only'>Filters</span>
			</Button>
		</div>
	);
}
