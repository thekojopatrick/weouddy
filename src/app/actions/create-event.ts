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
		const [hours, minutes] = data.time.split(':');
		const dateTime = new Date(data.date);
		dateTime.setHours(parseInt(hours, 10), parseInt(minutes, 10));

		const event = await prisma.event.create({
			data: {
				name: data.title,
				description: data.description,
				type: data.type,
				location: data.location,
				dateTime: dateTime,
				coverImage: data.coverImage,
				isPrivate: data.isPublic,
				hostId: session.user.id,
				slug: generateSlug(data.title),
			},
		});

		revalidatePath('/events');
		return event;
	} catch (error) {
		console.error('Failed to create event:', error);
		throw new Error('Failed to create event');
	}
}
