import { getSession } from '@/lib/auth';
import {
  JoinEventError,
  JoinEventService,
} from '@/server/services/event/join-event.service';
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
  } catch (error: unknown) {
    // Safe error logging that handles various error types
    const errorDetails = {
      message:
        error instanceof Error ? error.message : 'Unknown error',
      code: error instanceof JoinEventError ? error.code : 'UNKNOWN',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : typeof error,
    };

    console.error(
      'Join event error:',
      JSON.stringify(errorDetails, null, 2)
    );

    // Determine appropriate status code
    let statusCode = 500;
    if (error instanceof JoinEventError) {
      statusCode = 400;
    }

    return NextResponse.json(
      {
        success: false,
        error: errorDetails.message,
        code: errorDetails.code,
      },
      { status: statusCode }
    );
  }
}
