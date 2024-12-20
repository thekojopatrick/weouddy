import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getUserEventStatus } from "@/server/actions/user/queries";

export async function GET(
  request: Request,
  { params }: { params: { eventId: string } },
) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ status: "NOT_JOINED" });
    }

    const status = await getUserEventStatus(params.eventId, session.user.id);
    return NextResponse.json({ status });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch status" },
      { status: 500 },
    );
  }
}
