'use client';

import * as z from 'zod';

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { signIn, signUp, signUpWithGuest } from '../actions/actions';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase/client';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';

const authSchema = z.object({
	email: z.string().email(),
	password: z.string().min(6),
});

export function AuthForm() {
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
	const { toast } = useToast();

	useEffect(() => {
		const checkSession = async () => {
			const {
				data: { session },
			} = await supabase.auth.getSession();
			console.log({ session });

			if (session) {
				console.log({ session });

				// router.push('/rooms'); // Redirect to a protected route
			}
		};
		checkSession();
	}, [router]);

	const form = useForm<z.infer<typeof authSchema>>({
		resolver: zodResolver(authSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	const onSubmit = async (
		values: z.infer<typeof authSchema>,
		isSignUp: boolean
	) => {
		setIsLoading(true);
		try {
			const { error, success } = isSignUp
				? await signUp(values)
				: await signIn(values);

			if (error) throw error;

			// Ensure session is set
			if (success) {
				toast({
					title: isSignUp ? 'Account created!' : 'Welcome back!',
					description: isSignUp
						? 'Please check your email to verify your account.'
						: 'You have successfully signed in.',
				});

				router.push('/rooms'); // Redirect to a protected route
			}

			router.refresh();
		} catch (error: Error | unknown) {
			toast({
				title: 'Error',
				description: (error as Error).message || 'An unknown error occurred.',
				variant: 'destructive',
			});
			console.error(error);
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

	return (
		<Card className='w-full max-w-md mx-auto'>
			<CardHeader>
				<CardTitle>Authentication</CardTitle>
				<CardDescription>
					Sign in or create an account to continue
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Tabs defaultValue='signin'>
					<TabsList className='grid w-full grid-cols-2 mb-4'>
						<TabsTrigger value='signin'>Sign In</TabsTrigger>
						<TabsTrigger value='signup'>Sign Up</TabsTrigger>
					</TabsList>

					<TabsContent value='signin'>
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit((values) =>
									onSubmit(values, false)
								)}
								className='space-y-4'
							>
								<FormField
									control={form.control}
									name='email'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Email</FormLabel>
											<FormControl>
												<Input {...field} type='email' disabled={isLoading} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name='password'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Password</FormLabel>
											<FormControl>
												<Input
													{...field}
													type='password'
													disabled={isLoading}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<Button type='submit' className='w-full' disabled={isLoading}>
									{isLoading ? 'Just a sec..' : 'Sign In'}
								</Button>
							</form>
						</Form>
					</TabsContent>

					<TabsContent value='signup'>
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit((values) => onSubmit(values, true))}
								className='space-y-4'
							>
								<FormField
									control={form.control}
									name='email'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Email</FormLabel>
											<FormControl>
												<Input {...field} type='email' disabled={isLoading} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name='password'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Password</FormLabel>
											<FormControl>
												<Input
													{...field}
													type='password'
													disabled={isLoading}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<Button type='submit' className='w-full' disabled={isLoading}>
									{isLoading ? 'Signing up...' : 'Sign Up'}
								</Button>
							</form>
						</Form>
					</TabsContent>
				</Tabs>

				<div className='mt-6'>
					<div className='relative'>
						<div className='absolute inset-0 flex items-center'>
							<span className='w-full border-t' />
						</div>
						<div className='relative flex justify-center text-xs uppercase'>
							<span className='bg-background px-2 text-muted-foreground'>
								Or
							</span>
						</div>
					</div>
					<Button
						variant='outline'
						className='w-full mt-4'
						onClick={handleGuestAccess}
						disabled={isLoading}
					>
						Continue as Guest
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
