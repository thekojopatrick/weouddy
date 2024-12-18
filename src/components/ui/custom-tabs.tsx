import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { type LucideIcon } from 'lucide-react';

export interface TabItem {
	value: string;
	label: string;
	content: React.ReactNode;
	icon?: LucideIcon;
}

interface CustomTabsProps {
	items: TabItem[];
	variant?: 'pill' | 'underline' | 'icon';
	defaultValue?: string;
}

export function CustomTabs({
	items,
	variant = 'pill',
	defaultValue = items[0]?.value,
}: CustomTabsProps) {
	const getTabListClassName = () => {
		switch (variant) {
			case 'pill':
				return 'gap-1 bg-transparent';
			case 'underline':
				return 'h-auto gap-2 rounded-none border-b border-border bg-transparent px-0 py-1 text-foreground';
			case 'icon':
				return 'h-auto rounded-none border-b border-border bg-transparent p-0';
			default:
				return '';
		}
	};

	const getTabTriggerClassName = () => {
		switch (variant) {
			case 'pill':
				return 'rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none';
			case 'underline':
				return 'relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 hover:bg-accent hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent';
			case 'icon':
				return 'relative flex-col rounded-none px-4 py-2 text-xs after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary';
			default:
				return '';
		}
	};

	return (
		<Tabs defaultValue={defaultValue}>
			<TabsList className={cn(getTabListClassName())}>
				{items.map((item) => (
					<TabsTrigger
						key={item.value}
						value={item.value}
						className={cn(getTabTriggerClassName())}
					>
						{item.icon && variant === 'icon' && (
							<item.icon
								className='mb-1.5 opacity-60'
								size={16}
								strokeWidth={2}
								aria-hidden='true'
							/>
						)}
						{item.label}
					</TabsTrigger>
				))}
			</TabsList>
			{items.map((item) => (
				<TabsContent key={item.value} value={item.value}>
					{item.content}
				</TabsContent>
			))}
		</Tabs>
	);
}
