import { getSession } from "@/lib/auth";
import { EventService } from "@/server/services/event/get-event";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "12");
  const location = searchParams.get("location");
  const category = searchParams.get("category");

  try {
    const session = await getSession();
    const skip = (page - 1) * limit;

    const events = await EventService.getAll({
      skip,
      limit,
      location,
      category,
      userId: session?.userId,
      includeVendors: searchParams.get("includeVendors") === "true",
    });

    return NextResponse.json({
      events,
      page,
      limit,
    });
  } catch (error) {
    console.error("Route error:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 },
    );
  }
}
