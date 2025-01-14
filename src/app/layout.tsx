import './styles/globals.css';

import {
  cabinetGrotesk,
  geistMono,
  geistSans,
} from '@/components/ui/fonts';
import Script from 'next/script';

import type { Metadata } from 'next';
import { Toaster as SonnerToaster } from '@/components/ui/sonner';
import { Toaster } from '@/components/ui/toaster';
import { siteMeta } from '@/config/metadata';

export const metadata: Metadata = siteMeta;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=G-CD6PSSN7E2`}
        />
        <Script id="google-analytics">
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-CD6PSSN7E2', {
                page_path: window.location.pathname,
          });
        `}
        </Script>
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} ${cabinetGrotesk.variable} antialiased`}
      >
        <>{children}</>
        <Toaster />
        <SonnerToaster />
        <Script
          defer
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
        />
      </body>
    </html>
  );
}
