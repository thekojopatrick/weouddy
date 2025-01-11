'use server';

import { getSession } from '@/lib/auth';
import { JoinEventService } from '@/server/services/event/join-event.service';

export async function joinEventAction(
  identifier: string,
  pin?: string
) {
  const session = await getSession();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  return JoinEventService.joinEvent({
    identifier,
    pin,
    userId: session.user.id,
  });
}
