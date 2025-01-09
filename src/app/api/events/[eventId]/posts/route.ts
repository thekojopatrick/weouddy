import { db } from '@/server/db/prisma';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: { eventId: string } }
) {
  const { eventId } = await params;

  try {
    const posts = await db.post.findMany({
      where: { eventId },
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
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error(error);
    return new NextResponse('Error fetching posts', { status: 500 });
  }
}
