import { getSession } from '@/lib/auth';
import { JoinEventService } from '@/server/services/event/join-event.service';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { identifier, pin } = body;

    if (!identifier) {
      return NextResponse.json(
        { success: false, error: 'Event identifier is required' },
        { status: 400 }
      );
    }

    const result = await JoinEventService.joinEvent({
      identifier,
      pin,
      userId: session.user.id,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Join event error:', error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : 'Server error',
      },
      { status: error instanceof Error ? 400 : 500 }
    );
  }
}
