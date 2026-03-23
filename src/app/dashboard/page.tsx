"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/src/lib/auth-client";

type Playlist = {
  id: string;
  name: string;
};

export default function DashboardPage() {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loadingPlaylists, setLoadingPlaylists] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  //  fetching playlists here
  useEffect(() => {
    if (!session) return;

    const fetchPlaylists = async () => {
      try {
        const res = await fetch("/api/spotify/playlists");

        const data = await res.json();

        if (!res.ok) {
          console.log("API error:", data);
          throw new Error(data.error || "Failed to fetch playlists");
        }

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
    return <p>Loading...</p>;
  }

  if (!session) {
    return null;
  }

  return (
    <div className="p-6 space-y-6">
      {/* header */}
      <div>
        <h1 className="text-2xl font-semibold">
          Welcome, {session.user?.name}
        </h1>

        <button
          onClick={() =>
            authClient.signOut({
              fetchOptions: {
                onSuccess: () => router.push("/login"),
              },
            })
          }
          className="mt-4 px-4 py-2 bg-black text-white rounded"
        >
          Sign out
        </button>
      </div>

      {/* playlists */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Your Playlists</h2>

        {loadingPlaylists && <p>Loading playlists...</p>}

        {error && <p className="text-red-500">{error}</p>}

        {!loadingPlaylists && !error && playlists.length === 0 && (
          <p>No playlists found.</p>
        )}

        <ul className="space-y-2">
          {playlists.map((playlist) => (
            <li
              key={playlist.id}
              className="p-3 border rounded hover:bg-gray-50"
            >
              {playlist.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
