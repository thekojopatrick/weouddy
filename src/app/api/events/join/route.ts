import { db } from '@/server/db/prisma';
import { getSession } from '@/lib/auth';
import { NextResponse } from 'next/server';

const LOCK_TIMEOUT = 5000; // 5 seconds
const locks = new Map<string, number>();

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Validate request body
    let body;
    try {
      body = await req.json();
    } catch (e) {
      console.error('Join event bodey error:', e);
      return NextResponse.json(
        { success: false, error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const { identifier, pin } = body;

    if (!identifier) {
      return NextResponse.json(
        { success: false, error: 'Event identifier is required' },
        { status: 400 }
      );
    }

    // Check for existing lock
    const lockKey = `${session.user.id}-${identifier}`;
    const existingLock = locks.get(lockKey);
    if (existingLock && Date.now() - existingLock < LOCK_TIMEOUT) {
      return NextResponse.json(
        { success: false, error: 'Request in progress' },
        { status: 429 }
      );
    }

    // Set lock
    locks.set(lockKey, Date.now());

    // First, fetch the event
    const event = await db.event.findFirst({
      where: {
        OR: [{ id: identifier }, { slug: identifier }],
      },
      select: {
        id: true,
        slug: true,
        requiresApproval: true,
        isDisabled: true,
        accessType: true,
        pinCode: true,
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

    if (event.accessType === 'PIN_REQUIRED') {
      if (!pin) {
        return NextResponse.json(
          { success: false, error: 'PIN is required' },
          { status: 400 }
        );
      }
      if (pin !== event.pinCode) {
        return NextResponse.json(
          { success: false, error: 'Invalid PIN' },
          { status: 403 }
        );
      }
    }

    // Check existing attendance
    const existingAttendee = await db.attendee.findFirst({
      where: {
        userId: session.user.id,
        event: {
          OR: [{ id: identifier }, { slug: identifier }],
        },
      },
      include: {
        event: {
          select: { slug: true },
        },
      },
    });

    if (existingAttendee) {
      locks.delete(lockKey);
      if (existingAttendee.status === 'APPROVED') {
        return NextResponse.json({
          success: true,
          status: 'JOINED',
          event: { slug: existingAttendee.event.slug },
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
    console.error('Join event error:', error);
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}
