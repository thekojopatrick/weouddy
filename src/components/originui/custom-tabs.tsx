import { BookMarked, Box, House } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function TabDemo1() {
	return (
		<Tabs defaultValue='tab-1'>
			<TabsList className='gap-1 bg-transparent'>
				<TabsTrigger
					value='tab-1'
					className='rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none'
				>
					Tab 1
				</TabsTrigger>
				<TabsTrigger
					value='tab-2'
					className='rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none'
				>
					Tab 2
				</TabsTrigger>
				<TabsTrigger
					value='tab-3'
					className='rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none'
				>
					Tab 3
				</TabsTrigger>
			</TabsList>
			<TabsContent value='tab-1'>
				<p className='p-4 text-center text-xs text-muted-foreground'>
					Content for Tab 1
				</p>
			</TabsContent>
			<TabsContent value='tab-2'>
				<p className='p-4 text-center text-xs text-muted-foreground'>
					Content for Tab 2
				</p>
			</TabsContent>
			<TabsContent value='tab-3'>
				<p className='p-4 text-center text-xs text-muted-foreground'>
					Content for Tab 3
				</p>
			</TabsContent>
		</Tabs>
	);
}

export function TabDemo2() {
	return (
		<Tabs defaultValue='tab-1'>
			<TabsList className='h-auto gap-2 rounded-none border-b border-border bg-transparent px-0 py-1 text-foreground'>
				<TabsTrigger
					value='tab-1'
					className='relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 hover:bg-accent hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent'
				>
					Tab 1
				</TabsTrigger>
				<TabsTrigger
					value='tab-2'
					className='relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 hover:bg-accent hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent'
				>
					Tab 2
				</TabsTrigger>
				<TabsTrigger
					value='tab-3'
					className='relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 hover:bg-accent hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent'
				>
					Tab 3
				</TabsTrigger>
			</TabsList>
			<TabsContent value='tab-1'>
				<p className='p-4 text-center text-xs text-muted-foreground'>
					Content for Tab 1
				</p>
			</TabsContent>
			<TabsContent value='tab-2'>
				<p className='p-4 text-center text-xs text-muted-foreground'>
					Content for Tab 2
				</p>
			</TabsContent>
			<TabsContent value='tab-3'>
				<p className='p-4 text-center text-xs text-muted-foreground'>
					Content for Tab 3
				</p>
			</TabsContent>
		</Tabs>
	);
}

export function TabDemo3() {
	return (
		<Tabs defaultValue='tab-1'>
			<TabsList className='h-auto rounded-none border-b border-border bg-transparent p-0'>
				<TabsTrigger
					value='tab-1'
					className='relative flex-col rounded-none px-4 py-2 text-xs after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary'
				>
					<House
						className='mb-1.5 opacity-60'
						size={16}
						strokeWidth={2}
						aria-hidden='true'
					/>
					Overview
				</TabsTrigger>
				<TabsTrigger
					value='tab-2'
					className='relative flex-col rounded-none px-4 py-2 text-xs after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary'
				>
					<BookMarked
						className='mb-1.5 opacity-60'
						size={16}
						strokeWidth={2}
						aria-hidden='true'
					/>
					Repositories
				</TabsTrigger>
				<TabsTrigger
					value='tab-3'
					className='relative flex-col rounded-none px-4 py-2 text-xs after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary'
				>
					<Box
						className='mb-1.5 opacity-60'
						size={16}
						strokeWidth={2}
						aria-hidden='true'
					/>
					Packages
				</TabsTrigger>
			</TabsList>
			<TabsContent value='tab-1'>
				<p className='p-4 text-center text-xs text-muted-foreground'>
					Content for Tab 1
				</p>
			</TabsContent>
			<TabsContent value='tab-2'>
				<p className='p-4 text-center text-xs text-muted-foreground'>
					Content for Tab 2
				</p>
			</TabsContent>
			<TabsContent value='tab-3'>
				<p className='p-4 text-center text-xs text-muted-foreground'>
					Content for Tab 3
				</p>
			</TabsContent>
		</Tabs>
	);
}

export default function TabDemo() {
	return (
		<Tabs defaultValue='tab-1'>
			<TabsList className='relative h-auto w-full gap-0.5 bg-transparent p-0 before:absolute before:inset-x-0 before:bottom-0 before:h-px before:bg-border'>
				<TabsTrigger
					value='tab-1'
					className='overflow-hidden rounded-b-none border-x border-t border-border bg-muted py-2 data-[state=active]:z-10 data-[state=active]:shadow-none'
				>
					Tab 1
				</TabsTrigger>
				<TabsTrigger
					value='tab-2'
					className='overflow-hidden rounded-b-none border-x border-t border-border bg-muted py-2 data-[state=active]:z-10 data-[state=active]:shadow-none'
				>
					Tab 2
				</TabsTrigger>
				<TabsTrigger
					value='tab-3'
					className='overflow-hidden rounded-b-none border-x border-t border-border bg-muted py-2 data-[state=active]:z-10 data-[state=active]:shadow-none'
				>
					Tab 3
				</TabsTrigger>
			</TabsList>
			<TabsContent value='tab-1'>
				<p className='p-4 text-center text-xs text-muted-foreground'>
					Content for Tab 1
				</p>
			</TabsContent>
			<TabsContent value='tab-2'>
				<p className='p-4 text-center text-xs text-muted-foreground'>
					Content for Tab 2
				</p>
			</TabsContent>
			<TabsContent value='tab-3'>
				<p className='p-4 text-center text-xs text-muted-foreground'>
					Content for Tab 3
				</p>
			</TabsContent>
		</Tabs>
	);
}
