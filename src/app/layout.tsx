import "./styles/globals.css";

import { cabinetGrotesk, geistMono, geistSans } from "@/components/ui/fonts";

import type { Metadata } from "next";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import Provider from "./provider";
import Script from "next/script";

export const metadata: Metadata = {
  title: "WeOuddy - Real-Time Event Engagement",
  description: "Discover, share, and engage with moments that matter.",
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-title" content="WeOuddy" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${cabinetGrotesk.variable} antialiased`}
      >
        <Provider>
          <>
            {children}
            {modal}
          </>
          <Toaster />
          <SonnerToaster />
        </Provider>
        <Script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=G-ZXXP9Z24EN`}
        />
        <Script id="google-analytics">
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-ZXXP9Z24EN', {
                page_path: window.location.pathname,
          });
        `}
        </Script>
        {/* <Script
          id="map"
          async
          src={`https://maps.googleapis.com/maps/api/js?key=${env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
        /> */}
        <Script
          src="https://app.rybbit.io/api/script.js"
          data-site-id="707e49a46ebb"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
