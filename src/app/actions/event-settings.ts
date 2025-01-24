'use server';

import { getSession } from '@/lib/auth/server';
import { EventService } from '@/server/services/event';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const EventSettingsSchema = z.object({
  isPrivate: z.boolean().optional(),
  requiresApproval: z.boolean().optional(),
  allowComments: z.boolean().optional(),
  allowLikes: z.boolean().optional(),
  allowChat: z.boolean().optional(),
  allowPosts: z.boolean().optional(),
  pinCode: z.string().optional(),
  accessType: z
    .enum(['DIRECT_PASS', 'PIN_REQUIRED', 'INVITE_ONLY'])
    .optional(),
});

export async function updateEventSettings(
  eventId: string,
  settings: z.infer<typeof EventSettingsSchema>
) {
  const session = await getSession();

  if (!session) {
    throw new Error('Unauthorized');
  }

  try {
    console.log({ settings });

    const validatedSettings = EventSettingsSchema.parse(settings);

    console.log({ validatedSettings });

    await EventService.updateEventSettings(
      eventId,
      session.userId,
      validatedSettings
    );

    // Revalidate the event page to reflect new settings
    revalidatePath(`/events/${eventId}`);

    return {
      success: true,
      message: 'Event settings updated successfully',
    };
  } catch (error) {
    console.error('Failed to update event settings:', error);
    throw new Error('Failed to update event settings');
  }
}
