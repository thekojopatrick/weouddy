'use client';

import { loginSchema, signUpSchema } from '@/types/validation';
import { signIn, signUp, signUpWithGuest } from '@/app/auth/actions/actions';
import { useEffect, useState } from 'react';

import { LoginForm } from './login-form';
import { ResponsiveDialog } from '@/components/ui/responsive-dialog';
import { SignUpForm } from './signup-form';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';

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
	const [isLoading, setIsLoading] = useState(false);

	const router = useRouter();
	const { toast } = useToast();

	useEffect(() => {
		const checkSession = async () => {
			const {
				data: { session },
			} = await supabase.auth.getSession();

			if (session) {
				//router.push('/rooms'); // Redirect to a protected route
			}
		};
		checkSession();
	}, [router]);

	const handleSignUp = async (values: z.infer<typeof signUpSchema>) => {
		setIsLoading(true);
		try {
			const { error, success } = await signUp(values);

			if (error) throw error;

			if (success) {
				toast({
					title: 'Account created!',
					description: 'Please check your email to verify your account.',
				});

				router.push('/rooms');
			}

			router.refresh();
		} catch (error: Error | unknown) {
			toast({
				title: 'Error',
				description: (error as Error).message || 'An unknown error occurred.',
				variant: 'destructive',
			});
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleSignIn = async (values: z.infer<typeof loginSchema>) => {
		setIsLoading(true);
		try {
			const { error, success } = await signIn(values);

			if (error) throw error;

			if (success) {
				toast({
					title: 'Welcome back!',
					description: 'You have successfully signed in.',
				});

				router.push('/rooms');
			}

			router.refresh();
		} catch (error: Error | unknown) {
			toast({
				title: 'Error',
				description: (error as Error).message || 'An unknown error occurred.',
				variant: 'destructive',
			});
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const handleGuestAccess = async () => {
		setIsLoading(true);
		try {
			const { data, error } = await signUpWithGuest();

			if (error) throw error;

			if (data.session) {
				toast({
					title: 'Welcome!',
					description: 'You are now browsing as a guest.',
				});

				router.push('/rooms');
			}

			router.refresh();
		} catch (error: Error | unknown) {
			toast({
				title: 'Error',
				description: (error as Error).message || 'An unknown error occurred.',
				variant: 'destructive',
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleForgotPassword = () => {
		// TODO: Implement forgot password functionality
		toast({
			title: 'Forgot Password',
			description: 'Forgot password functionality coming soon.',
		});
	};
	return (
		<ResponsiveDialog open={open} onOpenChangeAction={onOpenChangeAction}>
			{view === 'login' ? (
				<LoginForm
					onSignUpClickAction={() => setView('signup')}
					onSubmitAction={handleSignIn}
					onForgotPassword={handleForgotPassword}
					isLoading={isLoading}
				/>
			) : (
				<SignUpForm
					onLoginClickAction={() => setView('login')}
					onSubmitAction={handleSignUp}
					isLoading={isLoading}
				/>
			)}
		</ResponsiveDialog>
	);
}
