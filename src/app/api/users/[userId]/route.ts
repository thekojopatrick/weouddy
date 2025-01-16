import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const { userId } = await params;
  try {
    if (!userId) {
      return new NextResponse('User ID Required', { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        username: true,
        avatarUrl: true,
        bio: true,
      },
    });

    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('[USER_GET_ERROR]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const { userId } = await params;
  try {
    const session = await getSession();
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { name, username, bio, avatarUrl } = body;

    if (!userId) {
      return new NextResponse('User ID Required', { status: 400 });
    }

    // Verify the authenticated user matches the requested user
    if (session.user.id !== userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        username,
        bio,
        avatarUrl,
      },
      select: {
        id: true,
        email: true,
        name: true,
        username: true,
        avatarUrl: true,
        bio: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('[USER_PATCH_ERROR]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
