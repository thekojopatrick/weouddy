'use server';

import { EventFormValues } from '@/types/validation';
import { generateSlug } from '@/lib/utils';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createEvent(data: EventFormValues) {
	const session = await getSession();

	if (!session) {
		throw new Error('Unauthorized');
	}

	try {
		const event = await prisma.event.create({
			data: {
				title: data.title,
				description: data.description,
				type: data.type,
				location: data.location,
				dateTime: new Date(data.date),
				time: data.time,
				coverImage: data.coverImage,
				isPublic: data.isPublic,
				userId: userId,
				slug: generateSlug(data.title), // You'll need to implement this helper
			},
		});

		revalidatePath('/events');
		return event;
	} catch (error) {
		console.error('Failed to create event:', error);
		throw new Error('Failed to create event');
	}
}
