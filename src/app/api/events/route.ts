import { EventService } from '@/server/services/event';
import { getSession } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getIp } from '@/lib/get-ip';
import { rateLimiter } from '@/server/services/ratelimiter/rate-limiter.service';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '12');
  const location = searchParams.get('location');
  const category = searchParams.get('category');

  const ip = getIp();

  // Rate limit API requests - 30 requests per minute per IP
  await rateLimiter.limitByIp({
    key: 'get-events',
    limit: 15,
    window: 60000,
  });

  try {
    const session = await getSession();

    const skip = (page - 1) * limit;

    const [events, total] = await Promise.all([
      EventService.getAll(
        skip,
        limit,
        location,
        category,
        session?.userId
      ),
      EventService.count(location, category, session?.userId),
    ]);

    return NextResponse.json({
      events,
      hasMore: skip + limit < total,
      nextPage: page + 1,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
