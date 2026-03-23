"use client";

import { useState } from "react";
import { FaSpotify } from "react-icons/fa";
import { BsAppleMusic } from "react-icons/bs";
import Link from "next/link";
import { authClient } from "@/src/lib/auth-client";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  const signIn = async () => {
    setLoading(true);
    await authClient.signIn.social({
      provider: "spotify",
      callbackURL: "/dashboard",
    });
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* left panel — branding */}
      <div className="hidden lg:flex w-1/2 bg-zinc-950 flex-col justify-between p-12">
        <Link href="/" className="text-white font-serif font-semibold tracking-tight">
          VibeSync
        </Link>

        <div>
          <h1
            className="text-5xl font-bold text-white leading-[1.1] tracking-tight font-serif"
          >
            Move your music.
            <br />
            <span className="text-zinc-400 font-serif">Keep your taste.</span>
          </h1>
          <p className="text-zinc-500 mt-4 text-sm leading-relaxed max-w-xs">
            Transfer playlists between Spotify and Apple Music — with AI that
            finds every track.
          </p>
        </div>

        {/* platform pills */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full">
            <FaSpotify className="w-3.5 h-3.5 text-green-400" />
            <span className="text-zinc-400 text-xs">Spotify</span>
          </div>
          <div className="text-zinc-700 text-xs">↔</div>

          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full">
            <BsAppleMusic className="w-3.5 h-3.5 text-red-400" />
            <span className="text-zinc-400 text-xs">Apple Music</span>
          </div>
        </div>
      </div>

      {/* Right panel — auth */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden text-zinc-950 font-serif font-semibold tracking-tight mb-10">
            VibeSync
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-zinc-950 tracking-tight">
              Get started
            </h2>
            <p className="text-zinc-500 text-sm mt-1">
              Connect a platform to begin transferring
            </p>
          </div>

          <div className="space-y-3">
            {/* spotify */}
            <button
              onClick={signIn}
              disabled={loading}
              className="w-full flex  items-center gap-3 px-4 py-3.5 bg-zinc-950  text-white rounded-xl transition-colors hover:text-green-400 duration-200 active:scale-[0.99]"
            >
              <FaSpotify className="w-5  h-5 flex-shrink-0" />
              <span className="text-sm font-medium">
                {loading ? "Connecting..." : "Continue with Spotify"}
              </span>
            </button>

            {/* apple music */}
            <button
              // disabled
              className="w-full flex items-center gap-3 px-4 py-3.5 bg-white border border-zinc-200 text-zinc-300 rounded-xl cursor-not-allowed"
            >
              <svg
                className="w-5 h-5 flex-shrink-0"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
              </svg>
              <span className="text-sm font-medium">
                Continue with Apple Music
              </span>
              <span className="ml-auto text-xs bg-zinc-100 text-zinc-400 px-2 py-0.5 rounded-full">
                Soon
              </span>
            </button>
          </div>

          <p className="text-zinc-400 text-xs text-center mt-8">
            We only access your playlists. Never your personal data.
          </p>
        </div>
      </div>
    </div>
  );
}
