'use client';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Drawer, DrawerContent } from '@/components/ui/drawer';
import { useEffect, useState } from 'react';

import { DialogTitle } from '@radix-ui/react-dialog';

interface ResponsiveDialogProps {
	open: boolean;
	onOpenChangeAction: (open: boolean) => void;
	children: React.ReactNode;
}

export function ResponsiveDialog({
	open,
	onOpenChangeAction,
	children,
}: ResponsiveDialogProps) {
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768);
		};

		checkMobile();
		window.addEventListener('resize', checkMobile);
		return () => window.removeEventListener('resize', checkMobile);
	}, []);

	if (isMobile) {
		return (
			<Drawer open={open} onOpenChange={onOpenChangeAction}>
				<DrawerContent className='px-4'>
					<div className='mx-auto w-full max-w-sm'>{children}</div>
				</DrawerContent>
			</Drawer>
		);
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChangeAction}>
			<DialogContent className='sm:max-w-[425px]'>
				<DialogTitle className='sr-only'>Modal</DialogTitle>
				{children}
			</DialogContent>
		</Dialog>
	);
}
