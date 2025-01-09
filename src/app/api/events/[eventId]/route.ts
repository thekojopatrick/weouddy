import { EventService } from '@/server/services/event';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: { eventId: string } }
) {
  const { eventId } = await params;

  try {
    const event = EventService.getBySlug(eventId);

    return NextResponse.json(event);
  } catch (error) {
    console.error(error);
    return new NextResponse('Error fetching posts', { status: 500 });
  }
}
