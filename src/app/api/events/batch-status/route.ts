import { UserEventService } from '@/server/services/user/event.service';
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

import { z } from 'zod';

const batchStatusSchema = z.object({
  eventIds: z.array(z.string()),
});

export async function POST(request: Request) {
  try {
    const session = await getSession();
    const { eventIds } = batchStatusSchema.parse(
      await request.json()
    );

    if (!session?.user) {
      return NextResponse.json(
        Object.fromEntries(eventIds.map((id) => [id, 'NOT_JOINED']))
      );
    }

    const statuses = await UserEventService.getBatchUserEventStatus(
      eventIds,
      session.user.id
    );
    return NextResponse.json(statuses);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to fetch statuses' },
      { status: 500 }
    );
  }
}
