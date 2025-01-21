'use server';

import { z } from 'zod';
import { validatedAction } from '@/utils/auth/middleware';
import { createClient } from '@/utils/supabase/server';
import { User } from '@supabase/supabase-js';
import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';

const prisma = new PrismaClient();

// Type definitions
type AuthResult = {
  success: boolean;
  error?: string;
  message?: string;
  user?: User;
  redirectPath?: string;
};

// Validation schemas
const signInSchema = z.object({
  email: z.string().email().min(3).max(255),
  password: z.string().min(8).max(100),
});

const signUpSchema = z.object({
  email: z.string().email().min(3).max(255),
  password: z.string().min(8).max(100),
  name: z.string().min(2).optional(),
});

const forgotPasswordSchema = z.object({
  email: z.string().email(),
  callbackUrl: z.string().url().optional(),
});

const resetPasswordSchema = z
  .object({
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

// Authentication actions

export const signInWithMagicLinkAction = validatedAction(
  z.object({
    email: z.string().email(),
    redirect: z.string().optional(),
    priceId: z.string().optional(),
  }),
  async (data) => {
    const supabase = await createClient();
    const { email, priceId } = data;
    const origin = (await headers()).get('origin');
    const redirectTo = `${origin}/auth/callback`;

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${redirectTo}?priceId=${encodeURIComponent(
          priceId || ''
        )}&redirect=${encodeURIComponent('/test')}`,
      },
    });
    if (error) {
      console.error('Error sending magic link:', error);
      return { error: error.message };
    }

    return { success: 'Magic link sent to your email.' };
  }
);

export const signInAction = validatedAction(
  signInSchema,
  async (data): Promise<AuthResult> => {
    const supabase = await createClient();

    try {
      const { data: authData, error: signInError } =
        await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });

      if (signInError) {
        return {
          success: false,
          error: signInError.message,
        };
      }

      if (!authData.user) {
        return {
          success: false,
          error: 'No user data returned',
        };
      }

      // Fetch or create user data
      const { error: userDataError } = await supabase
        .from('User')
        .select('*')
        .eq('email', authData.user.email)
        .single();

      if (userDataError && userDataError.code === 'PGRST116') {
        // No user data found, create initial record
        const { error: createError } = await supabase
          .from('User')
          .insert({
            id: authData.user.id,
            email: authData.user.email!,
            name: authData.user.email!.split('@')[0],
            username: authData.user.email!.split('@')[0],
            avatarUrl: `https://avatar.vercel.sh/${authData.user.id}.svg`,
          });

        if (createError) {
          console.error('Error creating user data:', createError);
        }
      }

      revalidatePath('/', 'layout');

      return {
        success: true,
        user: authData.user,
        redirectPath: '/discover',
      };
    } catch (error) {
      console.error('Sign in error:', error);
      return {
        success: false,
        error: 'An unexpected error occurred during sign in',
      };
    }
  }
);

export const signUpAction = validatedAction(
  signUpSchema,
  async (data): Promise<AuthResult> => {
    const supabase = await createClient();

    try {
      const { data: authData, error: signUpError } =
        await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            data: {
              full_name: data.name,
            },
          },
        });

      if (signUpError) {
        return {
          success: false,
          error: signUpError.message,
        };
      }

      if (!authData.user) {
        return {
          success: false,
          error: 'No user data returned',
        };
      }

      // Create initial user record
      try {
        await prisma.user.create({
          data: {
            id: authData.user.id,
            email: authData.user.email!,
            name: data.name ?? authData.user.email!.split('@')[0],
            username: authData.user.email!.split('@')[0],
            avatarUrl: `https://avatar.vercel.sh/${authData.user.id}.svg`,
            isAnonymous: false,
          },
        });
      } catch (dbError) {
        console.error('Database error:', dbError);
        // Don't fail the sign-up if DB sync fails
      }

      revalidatePath('/', 'layout');

      return {
        success: true,
        user: authData.user,
        redirectPath: '/discover',
      };
    } catch (error) {
      console.error('Sign up error:', error);
      return {
        success: false,
        error: 'An unexpected error occurred during sign up',
      };
    }
  }
);

export const signInWithGoogleAction =
  async (): Promise<AuthResult> => {
    const supabase = await createClient();
    const origin = (await headers()).get('origin');

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      if (data.url) {
        return {
          success: true,
          redirectPath: data.url,
        };
      }

      return {
        success: true,
      };
    } catch (error) {
      console.error('Google sign in error:', error);
      return {
        success: false,
        error: 'An unexpected error occurred during Google sign in',
      };
    }
  };

export const forgotPasswordAction = validatedAction(
  forgotPasswordSchema,
  async (data): Promise<AuthResult> => {
    const supabase = await createClient();
    const origin = (await headers()).get('origin');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        data.email,
        {
          redirectTo: `${origin}/auth/callback?redirect_to=/account/reset-password`,
        }
      );

      if (error) {
        return {
          success: false,
          error: 'Could not reset password',
        };
      }

      return {
        success: true,
        redirectPath: data.callbackUrl,
        message:
          'Check your email for a link to reset your password.',
      };
    } catch (error) {
      console.error('Password reset error:', error);
      return {
        success: false,
        error: 'An unexpected error occurred during password reset',
      };
    }
  }
);

export const resetPasswordAction = validatedAction(
  resetPasswordSchema,
  async (data): Promise<AuthResult> => {
    const supabase = await createClient();

    try {
      const { error } = await supabase.auth.updateUser({
        password: data.password,
      });

      if (error) {
        return {
          success: false,
          error: 'Password update failed',
        };
      }

      return {
        success: true,
        message: 'Password updated successfully',
        redirectPath: '/auth',
      };
    } catch (error) {
      console.error('Password update error:', error);
      return {
        success: false,
        error: 'An unexpected error occurred while updating password',
      };
    }
  }
);

export const signOut = async (): Promise<AuthResult> => {
  const supabase = await createClient();

  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    revalidatePath('/', 'layout');

    return {
      success: true,
      redirectPath: '/auth',
    };
  } catch (error) {
    console.error('Sign out error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred during sign out',
    };
  }
};
