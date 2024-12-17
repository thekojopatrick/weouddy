'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

interface ProfileTabsProps {
	stats: {
		events: number;
		posts: number;
		requests: number;
	};
}

export function ProfileTabs({ stats }: ProfileTabsProps) {
	const pathname = usePathname();

	const tabs = [
		{ name: 'Events', href: '/events', count: stats.events },
		{ name: 'Posts', href: '/posts', count: stats.posts },
		{ name: 'Request', href: '/requests', count: stats.requests },
	];

	return (
		<div className='border-b'>
			<div className='container mx-auto px-4'>
				<nav className='flex gap-4'>
					{tabs.map((tab) => (
						<Link
							key={tab.name}
							href={tab.href}
							className={cn(
								'px-2 py-4 text-sm font-medium border-b-2 transition-colors flex items-center',
								pathname.includes(tab.href)
									? 'border-primary text-primary'
									: 'border-transparent text-muted-foreground hover:text-foreground'
							)}
						>
							{tab.name}
							<span className='ml-2 rounded-full bg-muted px-2 py-0.5 text-xs font-medium'>
								{tab.count}
							</span>
						</Link>
					))}
				</nav>
			</div>
		</div>
	);
}
