import type { Metadata } from "next";
import { Playfair_Display, DM_Sans, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["700"],
});

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: {
    default: "Vibe Sync | Transfer music between platforms",
    template: "%s | Vibe Sync",
  },
  description:
    "Move your playlists between Spotify and Apple Music with AI-powered track matching. Never lose a song in translation.",
  keywords: ["music transfer", "spotify to apple music", "playlist transfer", "music migration"],
  authors: [{ name: "VibeSync" }],
  creator: "VibeSync",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://sage-vibesync.vercel.app",
    title: "VibeSync | Transfer music between platforms",
    description:
      "Move your playlists between Spotify and Apple Music with AI-powered track matching.",
    siteName: "Vibe Sync",
  },
  twitter: {
    card: "summary_large_image",
    title: "VibeSync | Transfer music between platforms",
    description:
      "Move your playlists between Spotify and Apple Music with AI-powered track matching.",
    creator: "@sagittaric",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", playfair.variable, "font-sans", geist.variable)}
    >
      <body
        className="min-h-full flex flex-col font-sans"
        style={{ fontFamily: "var(--font-sans)" }}
      >
        {children}
      </body>
    </html>
  );
}