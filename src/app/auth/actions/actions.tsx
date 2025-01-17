'use server';

import {
  LoginFormValues,
  SignUpFormValues,
} from '@/types/validation';

import { createClient } from '@/lib/supabase/server';
import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import { getURL } from '@/lib/utils';

const prisma = new PrismaClient();

type AuthResult = {
  success: boolean;
  error?: string;
  user?: User;
  redirectPath?: string;
};

export async function signIn(
  formData: LoginFormValues
): Promise<AuthResult> {
  try {
    const supabase = await createClient();

    const { error: signInError, data: authData } =
      await supabase.auth.signInWithPassword(formData);

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

    // Don't create Prisma user here - move it to the client side after successful auth
    revalidatePath('/', 'layout');

    return {
      success: true,
      user: authData.user,
    };
  } catch (error) {
    console.error('Sign in error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred during sign in',
    };
  }
}

export async function signUp(
  formData: SignUpFormValues
): Promise<AuthResult> {
  try {
    const supabase = await createClient();

    const { error: signUpError, data: authData } =
      await supabase.auth.signUp(formData);

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

    // Create initial user record in Prisma
    try {
      await prisma.user.create({
        data: {
          id: authData.user.id,
          email: authData.user.email || '',
          name: authData.user.email?.split('@')[0] ?? '',
          username: authData.user.email?.split('@')[0] ?? '',
          avatar_url: `https://avatar.vercel.sh/${authData.user.id}.svg`,
          is_anonymous: false,
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
    };
  } catch (error) {
    console.error('Sign up error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred during sign up',
    };
  }
}

export async function SignInWithGoogle() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${getURL()}auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  if (error) {
    console.error('Google Sign In Error:', error);
    return {
      success: false,
      error: error.message,
    };
  }

  if (data.url) {
    redirect(data.url);
  }

  return {
    success: true,
  };
}
