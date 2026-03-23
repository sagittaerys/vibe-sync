"use client";

import { FaSpotify } from "react-icons/fa";
import { authClient } from "@/src/lib/auth-client";

export default function LoginPage() {
 

 const signIn = async () => {
  await authClient.signIn.social({
    provider: "spotify",
    callbackURL: "/dashboard"
  })
}

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-8">

        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="text-4xl font-bold text-white tracking-tight">
            vibe<span className="text-green-400">sync</span>
          </div>
          <p className="text-zinc-400 text-sm">
            Transfer your music. Keep your vibe.
          </p>
        </div>

        {/* Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 space-y-6">
          <div className="space-y-1">
            <h1 className="text-white font-semibold text-lg">Get started</h1>
            <p className="text-zinc-500 text-sm">
              Connect your Spotify account to begin
            </p>
          </div>

          <button
            onClick={signIn}
            className="w-full flex items-center justify-center gap-3 bg-green-500 hover:bg-green-400 text-black font-semibold py-3 px-4 rounded-xl transition-all duration-200 active:scale-95"
          >
            <FaSpotify />
            Continue with Spotify
          </button>

          <p className="text-zinc-600 text-xs text-center">
            Apple Music support coming soon
          </p>
        </div>

        <p className="text-zinc-600 text-xs text-center">
          We only access your playlists. Nothing else.
        </p>
      </div>
    </div>
  );
}