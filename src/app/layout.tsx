import './styles/globals.css';

import { cabinetGrotesk, geistMono, geistSans } from '@/components/ui/fonts';

import type { Metadata } from 'next';
import { Toaster as SonnerToaster } from '@/components/ui/sonner';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
	title: 'WeOutside',
	description: 'connects to moments instead of events',
};

export default function RootLayout({
	children,
	modal,
}: Readonly<{
	children: React.ReactNode;
	modal: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body
				className={`${geistSans.variable} ${geistMono.variable} ${cabinetGrotesk.variable} antialiased`}
			>
				<>
					{children}
					{modal}
				</>
				<Toaster />
				<SonnerToaster />
				<script
					async
					src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&callback=initMap`}
				></script>
			</body>
		</html>
	);
}
