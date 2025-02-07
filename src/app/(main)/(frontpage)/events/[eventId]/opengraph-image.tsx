import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { EventService } from '@/server/services/event';

// Image metadata
export const alt = 'WeOuddy Event';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/jpg';

// Image generation
export default async function Image({
  params,
}: {
  params: { eventId: string };
}) {
  const id = (await params).eventId;
  const event = await EventService.getEvent(id);
  // Font loading, process.cwd() is Next.js project directory
  const interSemiBold = await readFile(
    join(process.cwd(), 'fonts/GeistVF.woff')
  );

  if (!event.coverImage) {
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 48,
            background: '#fafafa',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#1E1E1E',
            padding: '50px 200px',
          }}
        >
          👋 Hello!! Join &quot;{event.name}&quot; on WeOuddy.
        </div>
      ),
      {
        ...size,
        fonts: [
          {
            name: 'Geist',
            data: interSemiBold,
            style: 'normal',
            weight: 500,
          },
        ],
      }
    );
  }

  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#fafafa',
          width: '100%',
          height: '100%',
        }}
      >
        <img
          src={`${event.coverImage}`}
          height="100"
          style={{
            borderRadius: 12,
          }}
        />
      </div>
    ),
    // ImageResponse options
    {
      // For convenience, we can re-use the exported opengraph-image
      // size config to also set the ImageResponse's width and height.
      ...size,
      fonts: [
        {
          name: 'Geist',
          data: interSemiBold,
          style: 'normal',
          weight: 500,
        },
      ],
    }
  );
}
