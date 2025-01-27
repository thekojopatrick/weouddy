'use server';

import { getSession } from '@/lib/auth';
import { joinEventService } from '@/server/services/event/new-join-event.service';

export async function checkUserEventStatus({
  eventId,
  userId,
  slug,
}: {
  eventId: string;
  userId: string | null;
  slug: string | null;
}) {
  const session = await getSession();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  try {
    console.log('checking start');

    const result = await joinEventService.checkAttendeeStatus(
      eventId,
      userId!
    );

    if (result?.status === 'JOINED' || result?.status === 'PENDING') {
      //revalidatePath(`/events/${slug}`, 'page');
      // Also revalidate parent paths if needed
      //revalidatePath('/discover', 'page');
    }

    return {
      success: true,
      status: result?.status || 'PENDING',
      slug: slug,
    };
  } catch (err) {
    console.error(err);
    return { error: 'User event status check failed' };
  }
}
