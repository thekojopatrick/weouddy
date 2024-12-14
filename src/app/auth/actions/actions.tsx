'use server';

import { AuthFormValues } from '@/types/validation';
import { PrismaClient } from '@prisma/client';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

type AuthResult = {
	success: boolean;
	error?: string;
	redirectPath?: string;
};

export async function signIn(formData: AuthFormValues): Promise<AuthResult> {
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
		await prisma.user.upsert({
			where: { email: authData.user.email || '' },
			update: {},
			create: {
				email: authData.user.email || '',
				name: authData.user.email?.split('@')[0],
				isAnonymous: false,
			},
		});
	}

	revalidatePath('/', 'layout');
	return {
		success: true,
		redirectPath: '/',
	};
}

export async function signUp(formData: AuthFormValues): Promise<AuthResult> {
	const supabase = await createClient();

	const { error, data: authData } = await supabase.auth.signUp(formData);

	if (error) {
		return {
			success: false,
			error: error.message,
		};
	}

	// Create user in Prisma database after successful Supabase signup
	if (authData.user) {
		await prisma.user.create({
			data: {
				email: authData.user.email || '',
				name: authData.user.email?.split('@')[0],
				isAnonymous: false,
			},
		});
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
	if (data.user) {
		await prisma.user.create({
			data: {
				email: guestEmail,
				name: 'Guest User',
				isAnonymous: true,
			},
		});
	}

	revalidatePath('/', 'layout');

	return { error, data };
}
