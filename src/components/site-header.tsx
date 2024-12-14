'use client';

import { Button } from '@/components/ui/button';
import { CountrySelector } from './country-selector';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { Search } from 'lucide-react';

export function SiteHeader() {
	return (
		<header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
			<div className='container flex h-16 items-center'>
				<Link href='/' className='mr-8'>
					<span className='text-xl font-bold'>WeOuddy</span>
				</Link>
				<nav className='flex items-center space-x-6 text-sm font-medium'>
					<Link href='/' className='transition-colors hover:text-foreground/80'>
						Home
					</Link>
					<Link
						href='/billboards'
						className='transition-colors hover:text-foreground/80'
					>
						Billboards
					</Link>
					<Link
						href='/services'
						className='transition-colors hover:text-foreground/80'
					>
						Services
					</Link>
				</nav>
				<div className='ml-auto flex items-center space-x-4'>
					<div className='relative w-full max-w-sm'>
						<Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
						<Input
							type='search'
							placeholder='What are you looking for?'
							className='pl-8'
						/>
					</div>
					<Button variant='ghost' asChild>
						<Link href='/login'>Login</Link>
					</Button>
					<Button asChild>
						<Link href='/signup'>Sign up</Link>
					</Button>
					<CountrySelector />
				</div>
			</div>
		</header>
	);
}
