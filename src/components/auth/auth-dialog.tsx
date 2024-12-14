'use client';

import { LoginForm } from './login-form';
import { ResponsiveDialog } from '@/components/ui/responsive-dialog';
import { SignUpForm } from './signup-form';
import { useState } from 'react';

interface AuthDialogProps {
	open: boolean;
	onOpenChangeAction: (open: boolean) => void;
	defaultView?: 'login' | 'signup';
}

export function AuthDialog({
	open,
	onOpenChangeAction,
	defaultView = 'login',
}: AuthDialogProps) {
	const [view, setView] = useState<'login' | 'signup'>(defaultView);

	return (
		<ResponsiveDialog open={open} onOpenChangeAction={onOpenChangeAction}>
			{view === 'login' ? (
				<LoginForm onSignUpClickAction={() => setView('signup')} />
			) : (
				<SignUpForm onLoginClickAction={() => setView('login')} />
			)}
		</ResponsiveDialog>
	);
}
