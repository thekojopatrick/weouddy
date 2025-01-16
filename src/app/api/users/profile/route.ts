import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const data = await request.json();
    const { id } = data;

    // Verify the authenticated user matches the requested user
    if (session.user.id !== id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Try to find existing user
    const user = await prisma.user.findUnique({
      where: { id },
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
    console.error('[USER_PROFILE_ERROR]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
