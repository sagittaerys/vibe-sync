"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/src/lib/auth-client";
import { FaSpotify } from "react-icons/fa";
import NavBar from "../components/nav-bar";

type Playlist = {
  id: string;
  name: string;
  images: { url: string }[];
  tracks: { total: number };
};

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loadingPlaylists, setLoadingPlaylists] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isPending && !session) router.push("/login");
  }, [session, isPending, router]);

  useEffect(() => {
    if (!session) return;
    const fetchPlaylists = async () => {
      try {
        const res = await fetch("/api/spotify/playlists");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch playlists");
        setPlaylists(data.items || []);
      } catch (err) {
        console.error(err);
        setError("Could not load playlists");
      } finally {
        setLoadingPlaylists(false);
      }
    };
    fetchPlaylists();
  }, [session]);
  
  if (isPending) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin" />
      </div>
    );
  }
  
  // console.log(session);
  if (!session) return null;

  return (
    <div className="min-h-screen bg-white">
      {/* nav bar */}
      <NavBar
        userName={session.user?.name || "User"}
        imageUrl={session.user?.image || undefined}
        onSignOut={() =>
          authClient.signOut({
            fetchOptions: { onSuccess: () => router.push("/login") },
          })
        }
      />

      <main className="max-w-5xl mx-auto px-6 py-10 space-y-10">
        {/* Hero */}
        <div className="space-y-1">
          <h1 className="font-serif text-4xl font-bold text-zinc-950 tracking-tight">
            Your playlists
          </h1>
          <p className="text-zinc-500 text-sm">
            Select a playlist to transfer to another platform
          </p>
        </div>

        {/* Transfer CTA */}
        <div className="bg-zinc-950 rounded-2xl p-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-white font-medium text-sm">Ready to transfer?</p>
            <p className="text-zinc-400 text-xs mt-0.5">
              Move your playlists from Spotify to Apple Music
            </p>
          </div>
          <button
            disabled
            className="flex-shrink-0 px-4 py-2 bg-white text-zinc-400 text-sm font-medium rounded-xl cursor-not-allowed"
          >
            Coming soon
          </button>
        </div>

        {/* Playlists */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-xl font-bold text-zinc-950">
              Spotify playlists
            </h2>
            <div className="flex items-center gap-1.5 text-xs text-zinc-400">
              <FaSpotify className="w-3.5 h-3.5 text-green-500" />
              Connected
            </div>
          </div>

          {/* Loading state */}
          {loadingPlaylists && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="space-y-2 animate-pulse">
                  <div className="aspect-square bg-zinc-100 rounded-xl" />
                  <div className="h-3 bg-zinc-100 rounded w-3/4" />
                  <div className="h-3 bg-zinc-100 rounded w-1/2" />
                </div>
              ))}
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="py-10 text-center text-sm text-red-500">
              {error}
            </div>
          )}

          {/* Empty state */}
          {!loadingPlaylists && !error && playlists.length === 0 && (
            <div className="py-10 text-center text-sm text-zinc-400">
              No playlists found.
            </div>
          )}

          {/* Grid */}
          {!loadingPlaylists && !error && playlists.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {playlists.map((playlist) => (
                <button key={playlist.id} className="group text-left space-y-2">
                  {/* Artwork */}
                  <div className="aspect-square rounded-xl overflow-hidden bg-zinc-100 relative">
                    {playlist.images?.[0]?.url ? (
                      <img
                        src={playlist.images[0].url}
                        alt={playlist.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FaSpotify className="w-8 h-8 text-zinc-300" />
                      </div>
                    )}
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 rounded-xl flex items-center justify-center">
                      <span className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        Select
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div>
                    <p className="text-sm font-medium text-zinc-900 truncate">
                      {playlist.name}
                    </p>
                    <p className="text-xs text-zinc-400">
                      {playlist.tracks?.total} tracks
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
