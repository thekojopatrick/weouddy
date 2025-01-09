import { db } from "@/server/db/prisma";


export async function GET(
    req: Request,
    { params }: { params: { eventId: string } }
  ) {
    const posts = await db.post.findMany({
      where: { eventId: params.eventId },
      include: {
        user: {
          select: {
            name: true,
            avatarUrl: true,
            username: true,
          },
        },
        media: true,
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' }
    });
  
    return Response.json(posts);
  }