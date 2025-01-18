'use client';

import * as z from 'zod';

import { Card, CardContent } from '@/components/ui/card';
import { SignInWithGoogle, signIn, signUp } from '../actions';
import { loginSchema, signUpSchema } from '@/types/validation';
import { useEffect, useCallback, useState } from 'react';

import { LoginForm } from '@/components/auth/login-form';
import { SignUpForm } from '@/components/auth/signup-form';
import {
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export function AuthForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>(
    'login'
  );
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { toast } = useToast();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  // Initialize tab from URL on mount
  useEffect(() => {
    const view = searchParams.get('view');
    if (view === 'login' || view === 'signup') {
      setActiveTab(view);
    }
  }, [searchParams]);

  const handleSignUp = async (
    values: z.infer<typeof signUpSchema>
  ) => {
    setIsLoading(true);
    try {
      const { error, success } = await signUp(values);

      if (error) {
        toast({
          title: 'Error',
          description: error || 'Account creation not successfully',
        });
      }

      if (success) {
        toast({
          title: 'Account created!',
          description:
            'Please check your email to verify your account.',
        });

        router.push('/discover');
      }

      router.refresh();
    } catch (error: Error | unknown) {
      toast({
        title: 'Error',
        description:
          (error as Error).message || 'An unknown error occurred.',
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
      const result = await SignInWithGoogle();
      if (!result.success && result.error) {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description:
          'An unexpected error occurred during Google Sign-In.',
        variant: 'destructive',
      });
      console.error(
        'An unexpected error occurred during Google Sign-In:',
        error
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthSuccess = async (
    message: string,
    description: string,
    redirectPath: string = '/discover'
  ) => {
    toast({ title: message, description });

    // Use setTimeout to ensure state updates complete before navigation
    setTimeout(() => {
      router.push(redirectPath);
    }, 0);
  };

  const handleSignIn = async (
    values: z.infer<typeof loginSchema>
  ) => {
    setIsLoading(true);
    try {
      const response = await signIn(values);

      if (!response.success || response.error) {
        throw new Error(
          response.error || 'Invalid login credentials'
        );
      }

      if (response.success && response.user) {
        await handleAuthSuccess(
          'Welcome back!',
          'You have successfully signed in.'
        );
        return; // Exit early after successful auth
      }
    } catch (error) {
      toast({
        title: 'Authentication Failed',
        description:
          error instanceof Error
            ? error.message
            : 'Invalid login credentials',
      });
      console.error('Sign in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    router.push('/forgot-password');
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-sm">
      <CardContent>
        {activeTab === 'login' ? (
          <LoginForm
            onSubmitAction={handleSignIn}
            onSignUpClickAction={() => {
              setActiveTab('signup');
              router.push(
                pathname + '/' + createQueryString('', 'signup')
              );
            }}
            onForgotPassword={handleForgotPassword}
            isLoading={isLoading}
            onGoogleSignIn={handleGoogleSignIn}
          />
        ) : (
          <SignUpForm
            onSubmitAction={handleSignUp}
            onLoginClickAction={() => {
              setActiveTab('login');
              router.push(
                pathname + '?' + createQueryString('view', 'login')
              );
            }}
            isLoading={isLoading}
            onGoogleSignIn={handleGoogleSignIn}
          />
        )}
      </CardContent>
    </Card>
  );
}
