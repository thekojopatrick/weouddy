import { db } from '@/server/db/prisma';
import { getSession } from '@/lib/auth';
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

    const { identifier, pin } = await req.json();

    const event = await db.event.findFirst({
      where: {
        OR: [{ id: identifier }, { slug: identifier }],
      },
    });

    if (!event) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      );
    }

    if (event.isDisabled) {
      return NextResponse.json(
        { success: false, error: 'Event is disabled' },
        { status: 403 }
      );
    }

    if (
      event.accessType === 'PIN_REQUIRED' &&
      pin !== event.pinCode
    ) {
      return NextResponse.json(
        { success: false, error: 'Invalid PIN' },
        { status: 403 }
      );
    }

    // Check existing attendance
    const existingAttendee = await db.attendee.findFirst({
      where: {
        userId: session.user.id,
        eventId: event.id,
      },
    });

    if (existingAttendee) {
      if (existingAttendee.status === 'APPROVED') {
        return NextResponse.json({
          success: true,
          status: 'JOINED',
          event: { slug: event.slug },
        });
      }
      if (existingAttendee.status === 'PENDING') {
        return NextResponse.json({
          success: true,
          status: 'PENDING',
        });
      }
    }

    // Create new attendance
    const status = event.requiresApproval ? 'PENDING' : 'APPROVED';
    await db.attendee.create({
      data: {
        userId: session.user.id,
        eventId: event.id,
        status,
      },
    });

    // Log activity
    await db.eventActivity.create({
      data: {
        eventId: event.id,
        userId: session.user.id,
        type: 'JOIN',
      },
    });

    return NextResponse.json({
      success: true,
      status: status === 'PENDING' ? 'PENDING' : 'JOINED',
      event: { slug: event.slug },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}
