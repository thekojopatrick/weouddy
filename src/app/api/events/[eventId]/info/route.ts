import { db } from "@/server/db/prisma";
import { getSession } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { eventId: string } },
) {
  try {
    const { eventId } = await params;

    const session = await getSession();

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
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
      return NextResponse.json(
        { success: false, error: "Event not found" },
        { status: 404 },
      );
    }

    const userStatus = event.attendees[0]?.status || "NOT_JOINED";

    return NextResponse.json({
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
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 },
    );
  }
}
