import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getUserEventStatus } from "@/server/actions/user/queries";

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

    const status = await getUserEventStatus(eventId, session.user.id);

    console.log({ status });

    return NextResponse.json({ status });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch status" },
      { status: 500 },
    );
  }
}
