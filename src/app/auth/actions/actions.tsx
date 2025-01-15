'use server';

import {
  LoginFormValues,
  SignUpFormValues,
} from '@/types/validation';

import { PrismaClient } from '@prisma/client';
import { createClient } from '@/lib/supabase/server';
import { getNameInitials, getURL } from '@/lib/utils';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

type AuthResult = {
  success: boolean;
  error?: string;
  redirectPath?: string;
};

export async function signIn(
  formData: LoginFormValues
): Promise<AuthResult> {
  const supabase = await createClient();

  const { error, data: authData } =
    await supabase.auth.signInWithPassword(formData);

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  // Optional: Ensure user exists in Prisma database
  if (authData.user) {
    const checkForExistingUser = await prisma.user.findUnique({
      where: {
        id: authData.user.id,
      },
      select: {
        id: true,
      },
    });

    if (!checkForExistingUser) {
      await prisma.user.create({
        data: {
          id: authData.user.id,
          email: authData.user.email || '',
          name: authData.user.user_metadata.full_name ?? '',
          username: authData.user.email?.split('@')[0] ?? '',
          avatarUrl:
            authData.user.user_metadata.avatar_url ??
            `https://avatar.vercel.sh/${authData.user.id}.svg?text=${getNameInitials(authData.user.user_metadata.full_name)}` ??
            '',
          isAnonymous: false,
        },
      });
    }
  }

  revalidatePath('/', 'layout');
  return {
    success: true,
    redirectPath: '/',
  };
}
export async function signUp(
  formData: SignUpFormValues
): Promise<AuthResult> {
  const supabase = await createClient();

  const { error, data: authData } =
    await supabase.auth.signUp(formData);

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  // Create user in Prisma database after successful Supabase signup
  if (authData.user) {
    const checkForExistingUser = await prisma.user.findUnique({
      where: {
        id: authData.user.id,
      },
      select: {
        id: true,
      },
    });

    if (!checkForExistingUser) {
      await prisma.user.create({
        data: {
          id: authData.user.id,
          email: authData.user.email || '',
          name: authData.user.user_metadata.full_name ?? '',
          username: authData.user.email?.split('@')[0] ?? '',
          avatarUrl:
            authData.user.user_metadata.avatar_url ??
            `https://avatar.vercel.sh/${authData.user.id}.svg?text=${getNameInitials(authData.user.user_metadata.full_name)}` ??
            '',
          isAnonymous: false,
        },
      });
    }
  }

  revalidatePath('/', 'layout');
  return {
    success: true,
    redirectPath: '/',
  };
}

export async function signUpWithGuest() {
  const supabase = await createClient();
  const guestEmail = `guest_${Date.now()}@temporary.com`;

  const { error, data } = await supabase.auth.signInWithPassword({
    email: guestEmail,
    password: 'guest123',
  });

  // Create guest user in Prisma database

  revalidatePath('/', 'layout');

  return { error, data };
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
    return {
      success: false,
      error: error.message,
    };
  }

  if (data.url) {
    redirect(data.url);
  }
}
