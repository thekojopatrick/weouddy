'use client';

import * as z from 'zod';

import { Eye, EyeOff } from 'lucide-react';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { loginSchema } from '@/types/validation';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

interface LoginFormProps {
	isLoading: boolean;
	onSignUpClickAction: () => void;
	onSubmitAction: (values: z.infer<typeof loginSchema>) => void;
	onForgotPassword?: () => void;
}

export function LoginForm({
	onSignUpClickAction,
	onSubmitAction,
	onForgotPassword,
	isLoading,
}: LoginFormProps) {
	const [showPassword, setShowPassword] = useState(false);

	// Initialize the form with Zod resolver
	const form = useForm<z.infer<typeof loginSchema>>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	const handleSubmit = (values: z.infer<typeof loginSchema>) => {
		onSubmitAction(values);
	};

	return (
		<div className='grid gap-6'>
			<div className='flex flex-col items-center gap-2'>
				<Image
					src='/logomark.svg'
					alt='WeOuddy'
					width={48}
					height={48}
					className='h-16 w-16'
				/>
				<h1 className='text-2xl font-semibold tracking-tight'>Welcome Back!</h1>
			</div>

			<Button variant='outline' className='relative'>
				<Image
					src='/brand/google.svg'
					alt='Google'
					width={20}
					height={20}
					className='mr-2 h-5 w-5'
				/>
				Continue with Google
			</Button>

			<div className='relative'>
				<div className='absolute inset-0 flex items-center'>
					<span className='w-full border-t' />
				</div>
				<div className='relative flex justify-center text-xs uppercase'>
					<span className='bg-background px-2 text-muted-foreground'>or</span>
				</div>
			</div>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(handleSubmit)} className='grid gap-4'>
					<FormField
						control={form.control}
						name='email'
						render={({ field }) => (
							<FormItem>
								<FormLabel htmlFor='email'>Email</FormLabel>
								<FormControl>
									<Input
										id='email'
										type='email'
										placeholder='Your email address'
										{...field}
									/>
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
								<FormLabel htmlFor='password'>Password</FormLabel>
								<FormControl>
									<div className='relative'>
										<Input
											id='password'
											type={showPassword ? 'text' : 'password'}
											placeholder='Your password'
											{...field}
										/>
										<Button
											type='button'
											variant='ghost'
											size='icon'
											className='absolute right-2 top-1/2 -translate-y-1/2'
											onClick={() => setShowPassword(!showPassword)}
										>
											{showPassword ? (
												<EyeOff className='h-4 w-4' />
											) : (
												<Eye className='h-4 w-4' />
											)}
										</Button>
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button
						variant='link'
						type='button'
						className='px-0 text-sm justify-start'
						onClick={onForgotPassword}
					>
						Forgot password?
					</Button>

					<Button type='submit' className='w-full' disabled={isLoading}>
						Continue
					</Button>
				</form>
			</Form>

			<div className='text-center text-sm'>
				By continuing, you agree to WeOuddy&apos;s{' '}
				<Button variant='link' className='p-0 text-sm h-auto'>
					Terms of Service
				</Button>{' '}
				and{' '}
				<Button variant='link' className='p-0 text-sm h-auto'>
					Privacy Policy
				</Button>
				.
			</div>

			<div className='text-center'>
				{"Don't have an account? "}
				<Button variant='link' className='p-0' onClick={onSignUpClickAction}>
					Sign up
				</Button>
			</div>
		</div>
	);
}
