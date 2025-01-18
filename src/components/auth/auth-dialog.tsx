'use client';

import { SignInWithGoogle, signIn, signUp } from '@/app/auth/actions';
import { loginSchema, signUpSchema } from '@/types/validation';
import { useState, useCallback } from 'react';

import { LoginForm } from './login-form';
import { ResponsiveDialog } from '@/components/ui/responsive-dialog';
import { SignUpForm } from './signup-form';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
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

  const handleAuthSuccess = async (
    message: string,
    description: string,
    redirectPath: string = '/discover'
  ) => {
    toast.success(message, { description });
    onOpenChangeAction(false);
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
      toast.error('Authentication Failed', {
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

  const handleSignUp = async (
    values: z.infer<typeof signUpSchema>
  ) => {
    setIsLoading(true);
    try {
      const response = await signUp(values);

      if (!response.success || response.error) {
        throw new Error(response.error || 'Sign up failed');
      }

      if (response.success && response.user) {
        await handleAuthSuccess(
          'Account created!',
          'Please check your email to verify your account.'
        );
      }
    } catch (error) {
      toast.error('Sign Up Failed', {
        description:
          error instanceof Error
            ? error.message
            : 'An unknown error occurred',
      });
      console.error('Sign up error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const result = await SignInWithGoogle();
      if (!result?.success && result?.error) {
        throw new Error(result.error);
      }
      // OAuth redirect will handle the flow
    } catch (error) {
      toast.error('Google Sign In Failed', {
        description:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred',
      });
      console.error('Google sign in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = useCallback(() => {
    if (isLoading) return;

    setIsLoading(true);

    // Try multiple navigation methods
    try {
      Promise.resolve().then(() => {
        router.push('/forgot-password');

        // Fallback to window location if router fails
        setTimeout(() => {
          window.location.href = '/forgot-password';
        }, 100);
      });
    } catch (error) {
      console.error('Navigation error:', error);
      // Force navigation as last resort
      window.location.href = '/forgot-password';
    } finally {
      setIsLoading(false);
    }
  }, [router, isLoading]);

  return (
    <ResponsiveDialog
      open={open}
      onOpenChangeAction={onOpenChangeAction}
    >
      {view === 'login' ? (
        <LoginForm
          onSignUpClickAction={() => setView('signup')}
          onSubmitAction={handleSignIn}
          onForgotPassword={handleForgotPassword}
          isLoading={isLoading}
          onGoogleSignIn={handleGoogleSignIn}
        />
      ) : (
        <SignUpForm
          onLoginClickAction={() => setView('login')}
          onSubmitAction={handleSignUp}
          isLoading={isLoading}
          onGoogleSignIn={handleGoogleSignIn}
        />
      )}
    </ResponsiveDialog>
  );
}
