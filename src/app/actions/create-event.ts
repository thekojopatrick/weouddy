'use server';

import { EventService } from '@/server/services/event';
import { getSession } from '@/lib/auth';
import { EventFormValues } from '@/types/validation';
import { revalidatePath } from 'next/cache';

export async function createEvent(data: EventFormValues) {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');

  try {
    const event = await EventService.create(data, session.userId);
    revalidatePath('/discover');
    return event;
  } catch (error) {
    throw new Error(
      `Failed to create event: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}
