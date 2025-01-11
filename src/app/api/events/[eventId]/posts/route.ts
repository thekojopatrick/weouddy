import { PostService } from '@/server/services/post';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: { eventId: string } }
) {
  const { eventId } = await params;

  try {
    const posts = await PostService.getAllPosts(eventId);

    return NextResponse.json(posts);
  } catch (error) {
    console.error(error);
    return new NextResponse('Error fetching posts', { status: 500 });
  }
}
