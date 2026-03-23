import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["700"],
});

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "Vibe Sync — Transfer music between platforms",
    template: "%s | Vibe Sync",
  },
  description:
    "Move your playlists between Spotify and Apple Music with AI-powered track matching. Never lose a song in translation.",
  keywords: ["music transfer", "spotify to apple music", "playlist transfer", "music migration"],
  authors: [{ name: "Vibe Sync" }],
  creator: "Vibe Sync",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://sage-vibesync.vercel.app",
    title: "Vibe Sync — Transfer music between platforms",
    description:
      "Move your playlists between Spotify and Apple Music with AI-powered track matching.",
    siteName: "Vibe Sync",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vibe Sync — Transfer music between platforms",
    description:
      "Move your playlists between Spotify and Apple Music with AI-powered track matching.",
    creator: "@vibesync",
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
      className={`${playfair.variable} ${dmSans.variable} h-full antialiased`}
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