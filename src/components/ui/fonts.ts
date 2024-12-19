import { Inter } from "next/font/google";
import localFont from "next/font/local";

export const inter = Inter({ subsets: ["latin"] });

export const cabinetGroteskV = localFont({
  src: [
    {
      path: "../../app/fonts/cabinet-grotesk/CabinetGrotesk-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
});

export const cabinetGrotesk = localFont({
  src: "../../app/fonts/cabinet-grotesk/CabinetGrotesk-Variable.woff",
  variable: "--font-cabinet-grotesk",
  weight: "100 900",
});

export const geistSans = localFont({
  src: "../../app/fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

export const geistMono = localFont({
  src: "../../app/fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});
