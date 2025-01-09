import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: { postId: string } }
) {
  const { postId } = params;

  try {
    const session = await getSession();
    const currentUserId = session?.user?.id;

    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        _count: { select: { likes: true, comments: true } },
        likes: { where: { userId: currentUserId } },
      },
    });

    if (!post) {
      return new NextResponse('Post not found', { status: 404 });
    }

    return NextResponse.json({
      likes: post._count.likes,
      commentCount: post._count.comments,
      isLiked: post.likes.length > 0,
    });
  } catch (error) {
    console.error(error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
