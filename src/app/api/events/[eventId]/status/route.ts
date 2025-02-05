import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { joinEventService } from "@/server/services/event/new-join-event.service";

export async function GET(
  request: Request,
  { params }: { params: { eventId: string } },
) {
  try {
    const session = await getSession();

    const { eventId } = await params;

    if (!session?.user) {
      return NextResponse.json({ status: "NOT_JOINED" });
    }

    // First, check the existing method
    const attendee = await joinEventService.checkAttendeeStatus(
      eventId,
      session.user.id,
    );

    // If status is NOT_JOINED, double-check with Attendee table

    return NextResponse.json({
      status: attendee?.status === "APPROVED" ? "JOINED" : "NOT_JOINED",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch status" },
      { status: 500 },
    );
  }
}
