"use client";

//import posthog from "posthog-js";
//import { PostHogProvider } from "posthog-js/react";
import { ReactNode } from "react";
import TanstackQueryProvider from "./tanstackQuery-provider";
import { ThemeProvider } from "./theme-provider";

//import { env } from "@/env";
//import { RootProvider } from "fumadocs-ui/provider";

// if (typeof window !== "undefined") {
//   posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
//     api_host: env.NEXT_PUBLIC_POSTHOG_HOST,
//     capture_pageview: false,
//   });
// }

export function Providers({ children }: { children: ReactNode }) {
  return (
    <TanstackQueryProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
        {/* <PostHogProvider client={posthog}>{children}</PostHogProvider> */}
      </ThemeProvider>
    </TanstackQueryProvider>
  );
}
