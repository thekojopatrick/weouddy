'use client';

import React from 'react';
import { ResponsiveDialog } from '@/components/ui/responsive-dialog';

interface JoinEventDialogProps {
	open: boolean;
	onOpenChangeAction: (open: boolean) => void;
}

const JoinEventDialog = ({
	open,
	onOpenChangeAction,
}: JoinEventDialogProps) => {
	return (
		<ResponsiveDialog
			open={open}
			onOpenChangeAction={onOpenChangeAction}
			className='sm:max-w-[620px] p-0 overflow-hidden'
		>
			Join EventDialog
		</ResponsiveDialog>
	);
};

export default JoinEventDialog;
