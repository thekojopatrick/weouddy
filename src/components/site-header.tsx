'use client';

import { Button } from '@/components/ui/button';
import { CountrySelector } from './country-selector';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { NavUser } from './nav-user';
import { Search } from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { useAccount } from '@/hooks/account/use-account';
import { useMediaQuery } from '@/hooks/useMediaQuery';

export function SiteHeader({ user }: { user: User | null }) {
	const isSmallDevice = useMediaQuery('only screen and (max-width : 768px)');

	const { accountData, loading } = useAccount(user);

	return (
		<header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
			<div className='flex h-16 items-center max-w-7xl md:px-6 mx-auto gap-x-2'>
				<Link href='/'>
					<Image
						src={isSmallDevice ? '/logomark.svg' : '/logo.svg'}
						alt={'WeOuddy'}
						className='object-cover'
						width={isSmallDevice ? 150 : 120}
						height={isSmallDevice ? 150 : 120}
					/>
					<span className='text-xl font-bold sr-only'>WeOuddy</span>
				</Link>
				<nav className='hidden md:flex items-center space-x-6 text-sm font-medium'>
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
				<div className='relative w-full max-w-sm mx-auto'>
					<Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
					<Input
						type='search'
						placeholder='What are you looking for?'
						className='pl-8 shadow-none rounded-full bg-gray-50 text-gray-500 hover:bg-gray-100'
					/>
				</div>
				<div className='md:ml-auto flex items-center space-x-3'>
					{!loading && accountData ? (
						<NavUser
							user={{
								name: `${accountData.fullname || 'Anonymous'}`,
								email: accountData.email ?? 'unknown@email.com',
								avatar: accountData.avatarUrl ?? '',
								username:
									accountData.username! ?? accountData.email?.split('@')[0],
							}}
						/>
					) : (
						<Button variant='outline' className='rounded-full' asChild>
							<Link href='/auth'>Login</Link>
						</Button>
					)}
					<CountrySelector />
				</div>
			</div>
		</header>
	);
}
