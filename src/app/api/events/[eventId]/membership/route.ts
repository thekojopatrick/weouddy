import { NextResponse } from 'next/server';
import { z } from 'zod';
import { AttendeeStatus } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/utils/supabase/server';

// Simplified parameter validation
const paramsSchema = z.string().min(1);

export async function GET(
  request: Request,
  { params }: { params: { eventId: string } }
) {
  const { eventId } = await params;

  // Get authenticated user
  const supabase = await createClient();

  try {
    // Validate eventId
    const result = paramsSchema.safeParse(eventId);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid event ID' },
        { status: 400 }
      );
    }

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized', status: 'NOT_JOINED' },
        { status: 401 }
      );
    }

    // Check if user is a member of the event
    const membership = await prisma.attendee.findUnique({
      where: {
        userId_eventId: {
          userId: user.id,
          eventId: eventId,
        },
      },
      select: {
        status: true,
      },
    });

    // If no membership found, return NOT_JOINED
    if (!membership) {
      return NextResponse.json(
        { status: 'NOT_JOINED' },
        { status: 200 }
      );
    }

    // Map AttendeeStatus to UserEventStatus
    const statusMap: Record<AttendeeStatus, string> = {
      PENDING: 'PENDING',
      APPROVED: 'JOINED',
      REJECTED: 'NOT_JOINED',
    };

    return NextResponse.json(
      { status: statusMap[membership.status] },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error checking membership:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
