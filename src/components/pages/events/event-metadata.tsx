import { EventWithFullData } from '@/types/event';
import Head from 'next/head';
import { formatEventDateTime } from '@/lib/formatters';

interface EventMetadataProps {
	event: EventWithFullData;
	currentUrl: string;
}

const EventMetadata = ({ event, currentUrl }: EventMetadataProps) => {
	const { date, time } = formatEventDateTime(event?.dateTime as never);

	return (
		<Head>
			<title>{event.name} | WeOuddy</title>
			<meta
				name='description'
				content={`Join ${event.name} on ${date} at ${time}. ${event.location}`}
			/>

			{/* Open Graph meta tags */}
			<meta property='og:title' content={event.name} />
			<meta
				property='og:description'
				content={`Join ${event.name} on ${date} at ${time}. ${event.location}`}
			/>
			<meta property='og:type' content='event' />
			<meta property='og:url' content={currentUrl} />
			<meta
				property='og:image'
				content={event.coverImage || '/assets/default-event-cover.png'}
			/>
			<meta property='og:site_name' content='WeOuddy' />

			{/* Twitter Card meta tags */}
			<meta name='twitter:card' content='summary_large_image' />
			<meta name='twitter:title' content={event.name} />
			<meta
				name='twitter:description'
				content={`Join ${event.name} on ${date} at ${time}. ${event.location}`}
			/>
			<meta
				name='twitter:image'
				content={event.coverImage || '/assests/default-event-cover.png'}
			/>

			{/* WhatsApp specific meta tags */}
			<meta property='og:image:width' content='1200' />
			<meta property='og:image:height' content='630' />
		</Head>
	);
};

export default EventMetadata;
