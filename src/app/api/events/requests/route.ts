import { getSession } from "@/lib/auth";
import { fetchPendingRequests } from "@/server/actions/user/queries";
import { rateLimiter } from "@/server/services/ratelimiter/rate-limiter.service";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  await rateLimiter.limitByIp({
    key: "get-events-requests",
    limit: 15,
    window: 60000,
  });

  try {
    const requests = await fetchPendingRequests(session.userId);
    return Response.json(requests);
  } catch (error) {
    console.error("Error fetching requests:", error);
    return new Response("Failed to fetch requests", { status: 500 });
  }
}
