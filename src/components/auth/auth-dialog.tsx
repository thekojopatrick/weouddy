'use client';

import {
  SignInWithGoogle,
  signIn,
  signUp,
  signUpWithGuest,
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
        //router.push('/rooms'); // Redirect to a protected route
      }
    };
    checkSession();
  }, [router]);

  const handleSignUp = async (
    values: z.infer<typeof signUpSchema>
  ) => {
    setIsLoading(true);
    try {
      const { error, success } = await signUp(values);

      if (error) throw error;

      if (success) {
        toast.success('Account created!', {
          description:
            'Please check your email to verify your account.',
        });

        router.replace('/discover');
      }

      router.refresh();
    } catch (error: Error | unknown) {
      toast.error('An unknown error occurred.');
      console.error(error);
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

      if (error) throw error;

      if (success) {
        toast('Welcome back!', {
          description: 'You have successfully signed in.',
        });

        router.refresh();
      }

      router.refresh();
    } catch (error: Error | unknown) {
      toast.error('Authentication Error', {
        description: 'Invaild login credentials',
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
        toast.info('Welcome!', {
          description: 'You are now browsing as a guest.',
        });

        router.refresh();
      }

      router.refresh();
    } catch (error: Error | unknown) {
      toast.error('Error', {
        description: 'An unknown error occurred.',
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // TODO: Implement forgot password functionality
    toast.info('Forgot Password', {
      description:
        'Forgot password functionality coming soon.Contact support for assistance.',
    });
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await SignInWithGoogle();
    } catch (error) {
      toast.error('Error', {
        description:
          'An unexpected error occurred during Google Sign-In.',
      });
      console.error(
        'An unexpected error occurred during Google Sign-In:',
        error
      );
    } finally {
      setIsLoading(false);
    }
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
