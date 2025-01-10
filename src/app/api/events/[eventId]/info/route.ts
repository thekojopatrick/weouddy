import { db } from '@/server/db/prisma';
import { getSession } from '@/lib/auth';

export async function GET(
  req: Request,
  { params }: { params: { eventId: string } }
) {
  try {
    const { eventId } = await params;
    const session = await getSession();
    if (!session?.user) {
      return Response.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const event = await db.event.findFirst({
      where: {
        OR: [{ id: eventId }, { slug: eventId }],
      },
      include: {
        attendees: {
          where: {
            userId: session.user.id,
          },
        },
      },
    });

    if (!event) {
      return Response.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      );
    }

    const userStatus = event.attendees[0]?.status || 'NOT_JOINED';

    return Response.json({
      success: true,
      event: {
        id: event.id,
        slug: event.slug,
        isPrivate: event.isPrivate,
        isDisabled: event.isDisabled,
        requiresApproval: event.requiresApproval,
        accessType: event.accessType,
      },
      userStatus,
    });
  } catch (error) {
    console.error(error);
    return Response.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}
