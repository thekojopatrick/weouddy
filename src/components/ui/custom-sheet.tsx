'use client';

import React, { ReactNode, useRef, useState } from 'react';
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet';

interface CustomSheetProps {
	isOpen: boolean;
	onCloseAction: () => void;
	trigger?: ReactNode;
	title: string;
	content: ReactNode;
	stickyHeader?: boolean;
	stickyFooter?: boolean;
	scrollableContent?: boolean;
	maxHeight?: string;
	maxWidth?: string;
	side?: 'top' | 'right' | 'bottom' | 'left';
	onScrollToBottom?: () => void;
	footerContent?: ReactNode;
}

export default function CustomSheet({
	isOpen,
	onCloseAction,
	trigger,
	title,
	content,
	stickyHeader = false,
	stickyFooter = false,
	scrollableContent = true,
	maxHeight = 'min(640px,80vh)',
	maxWidth = 'lg',
	side = 'right',
	onScrollToBottom,
	footerContent,
}: CustomSheetProps) {
	const [hasReadToBottom, setHasReadToBottom] = useState(false);
	const contentRef = useRef<HTMLDivElement>(null);

	const handleScroll = () => {
		const content = contentRef.current;
		if (!content) return;

		const scrollPercentage =
			content.scrollTop / (content.scrollHeight - content.clientHeight);
		if (scrollPercentage >= 0.99 && !hasReadToBottom) {
			setHasReadToBottom(true);
			onScrollToBottom?.();
		}
	};

	return (
		<Sheet open={isOpen} onOpenChange={onCloseAction}>
			<SheetTrigger asChild>{trigger}</SheetTrigger>
			<SheetContent
				side={side}
				className={`flex flex-col gap-0 p-0 sm:max-h-[${maxHeight}] sm:max-w-${maxWidth} [&>button:last-child]:top-3.5`}
			>
				<SheetHeader
					className={`contents space-y-0 text-left ${stickyHeader ? 'sticky top-0 z-10 bg-background' : ''}`}
				>
					<SheetTitle className='border-b border-border px-6 py-4 text-base'>
						{title}
					</SheetTitle>
				</SheetHeader>
				<div
					ref={contentRef}
					onScroll={scrollableContent ? handleScroll : undefined}
					className={`
            ${scrollableContent ? 'overflow-y-auto' : ''}
            ${!stickyHeader && !stickyFooter ? 'flex-grow' : ''}
            ${side === 'left' || side === 'right' ? `max-h-[calc(100vh-8rem)]` : ''}
          `}
				>
					<SheetDescription asChild>{content}</SheetDescription>
				</div>
				{footerContent && (
					<SheetFooter
						className={`border-t border-border px-6 py-4 sm:items-center ${stickyFooter ? 'sticky bottom-0 z-10 bg-background' : ''}`}
					>
						{footerContent}
					</SheetFooter>
				)}
			</SheetContent>
		</Sheet>
	);
}
