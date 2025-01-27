import { getSession } from '@/lib/auth';
import { JoinEventError } from '@/server/services/event/join-event.service';
import { joinEventService } from '@/server/services/event/new-join-event.service';
import { joinEvent } from '@/server/services/event/test-join-event';
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

    const attendee = await joinEventService.checkAttendeeStatus(
      identifier,
      session.user.id
    );

    if (attendee?.status === 'APPROVED') {
      console.log('JOINED');

      return NextResponse.json(attendee);
    }

    const result = await joinEvent({
      identifier,
      userId: session.user.id,
      pin,
    });

    console.log({ result });

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
