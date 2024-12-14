'use client';

import { Eye, EyeOff } from 'lucide-react';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

interface LoginFormProps {
	onSignUpClickAction: () => void;
}

export function LoginForm({ onSignUpClickAction }: LoginFormProps) {
	const [showPassword, setShowPassword] = useState(false);

	return (
		<div className='grid gap-6'>
			<div className='flex flex-col items-center gap-2'>
				<Image
					src='/logo.svg'
					alt='WeOuddy'
					width={48}
					height={48}
					className='h-12 w-12'
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

			<div className='grid gap-4'>
				<div className='grid gap-2'>
					<Label htmlFor='email'>Email</Label>
					<Input id='email' type='email' placeholder='Your email address' />
				</div>

				<div className='grid gap-2'>
					<Label htmlFor='password'>Password</Label>
					<div className='relative'>
						<Input
							id='password'
							type={showPassword ? 'text' : 'password'}
							placeholder='Your password'
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
				</div>

				<Button variant='link' className='px-0 text-sm justify-start'>
					Forgot password?
				</Button>
			</div>

			<Button className='w-full'>Continue</Button>

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
