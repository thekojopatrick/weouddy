'use client';

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import React, { ReactNode, useRef, useState } from 'react';

interface CustomDialogProps {
	trigger: ReactNode;
	title: string;
	content: ReactNode;
	stickyHeader?: boolean;
	stickyFooter?: boolean;
	scrollableContent?: boolean;
	maxHeight?: string;
	maxWidth?: string;
	onScrollToBottom?: () => void;
	footerContent?: ReactNode;
}

export default function CustomDialog({
	trigger,
	title,
	content,
	stickyHeader = false,
	stickyFooter = false,
	scrollableContent = true,
	maxHeight = 'min(640px,80vh)',
	maxWidth = 'lg',
	onScrollToBottom,
	footerContent,
}: CustomDialogProps) {
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
		<Dialog>
			<DialogTrigger asChild>{trigger}</DialogTrigger>
			<DialogContent
				className={`flex flex-col gap-0 p-0 sm:max-h-[${maxHeight}] sm:max-w-${maxWidth} [&>button:last-child]:top-3.5`}
			>
				<DialogHeader
					className={`contents space-y-0 text-left ${stickyHeader ? 'sticky top-0 z-10 bg-background' : ''}`}
				>
					<DialogTitle className='border-b border-border px-6 py-4 text-base'>
						{title}
					</DialogTitle>
				</DialogHeader>
				<div
					ref={contentRef}
					onScroll={scrollableContent ? handleScroll : undefined}
					className={`${scrollableContent ? 'overflow-y-auto' : ''} ${!stickyHeader && !stickyFooter ? 'flex-grow' : ''}`}
				>
					<DialogDescription asChild>{content}</DialogDescription>
				</div>
				{footerContent && (
					<DialogFooter
						className={`border-t border-border px-6 py-4 sm:items-center ${stickyFooter ? 'sticky bottom-0 z-10 bg-background' : ''}`}
					>
						{footerContent}
					</DialogFooter>
				)}
			</DialogContent>
		</Dialog>
	);
}
