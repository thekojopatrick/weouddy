import { EventService } from '@/server/services/event';
import { getSession } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function GET() {
  try {
    const session = await getSession();

    const events = await EventService.getAll(session?.userId);

    return NextResponse.json(events);
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
