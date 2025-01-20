import { UserEventService } from '@/server/services/user/event.service';
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

import { z } from 'zod';
import { rateLimiter } from '@/server/services/ratelimiter/rate-limiter.service';

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

    // Rate limit API requests - 30 requests per minute per IP
    await rateLimiter.limitByIp({
      key: 'get-events-statuses',
      limit: 5,
      window: 15000,
    });

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
