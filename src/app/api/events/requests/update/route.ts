import { getSession } from "@/lib/auth";
import { updateRequestStatus } from "@/server/actions/user/queries";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { requestId, status } = await request.json();

  try {
    const updatedRequest = await updateRequestStatus(requestId, status);
    return Response.json(updatedRequest);
  } catch (error) {
    console.error(error);
    return new Response("Failed to update request", { status: 500 });
  }
}
