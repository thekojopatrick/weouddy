'use client';

import * as z from 'zod';

import { Card, CardContent } from '@/components/ui/card';
import {
	SignInWithGoogle,
	signIn,
	signUp,
	signUpWithGuest,
} from '../actions/actions';
import { loginSchema, signUpSchema } from '@/types/validation';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { LoginForm } from '@/components/auth/login-form';
import { SignUpForm } from '@/components/auth/signup-form';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export function AuthForm() {
	const [isLoading, setIsLoading] = useState(false);
	const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
	const router = useRouter();
	const { toast } = useToast();

	useEffect(() => {
		const checkSession = async () => {
			const {
				data: { session },
			} = await supabase.auth.getSession();

			if (session) {
				router.push('/discover'); // Redirect to a protected route
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

				router.push('/discover');
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

	const handleGoogleSignIn = async () => {
		setIsLoading(true);
		try {
			const { error, success, redirectPath } = await SignInWithGoogle();

			if (error) throw error;

			if (success) {
				toast({
					title: 'Welcome!',
					description: 'You have successfully signed in.',
				});

				router.push(`${redirectPath}`);
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

				router.push('/discover');
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

				router.push('/discover');
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
		<Card className='w-full max-w-md mx-auto shadow-sm'>
			<CardContent>
				{activeTab === 'login' ? (
					<LoginForm
						onSubmitAction={handleSignIn}
						onSignUpClickAction={() => setActiveTab('signup')}
						onForgotPassword={handleForgotPassword}
						isLoading={isLoading}
						onGoogleSignIn={handleGoogleSignIn}
					/>
				) : (
					<SignUpForm
						onSubmitAction={handleSignUp}
						onLoginClickAction={() => setActiveTab('login')}
						isLoading={isLoading}
						onGoogleSignIn={handleGoogleSignIn}
					/>
				)}

				<Button
					variant='outline'
					className='w-full mt-4'
					onClick={handleGuestAccess}
					disabled={isLoading}
				>
					Continue as Guest
				</Button>
			</CardContent>
		</Card>
	);
}
