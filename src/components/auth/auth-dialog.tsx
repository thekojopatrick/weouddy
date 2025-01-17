'use client';

import {
  SignInWithGoogle,
  signIn,
  signUp,
} from '@/app/auth/actions/actions';
import { loginSchema, signUpSchema } from '@/types/validation';
import { useEffect, useState } from 'react';

import { LoginForm } from './login-form';
import { ResponsiveDialog } from '@/components/ui/responsive-dialog';
import { SignUpForm } from './signup-form';
import { supabase } from '@/lib/supabase/client';
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

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        onOpenChangeAction(false);
        router.refresh();
      }
    };
    checkSession();
  }, [router, onOpenChangeAction]);

  const handleAuthSuccess = (
    message: string,
    description: string
  ) => {
    toast.success(message, { description });
    onOpenChangeAction(false);
    router.refresh();
  };

  const handleSignUp = async (
    values: z.infer<typeof signUpSchema>
  ) => {
    setIsLoading(true);
    try {
      const { error, success } = await signUp(values);

      if (error) throw new Error(error);

      if (success) {
        handleAuthSuccess(
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

  const handleSignIn = async (
    values: z.infer<typeof loginSchema>
  ) => {
    setIsLoading(true);
    try {
      const { error, success } = await signIn(values);

      if (error) throw new Error(error);

      if (success) {
        handleAuthSuccess(
          'Welcome back!',
          'You have successfully signed in.'
        );
      }
    } catch (error) {
      toast.error('Authentication Failed', {
        description: 'Invalid login credentials',
      });
      console.error('Sign in error:', error);
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
      // No need to call handleAuthSuccess here as the OAuth redirect will handle the flow
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

  const handleForgotPassword = () => {
    // TODO: Implement forgot password functionality
    toast.info('Forgot Password', {
      description:
        'Forgot password functionality coming soon. Contact support for assistance.',
    });
  };

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
