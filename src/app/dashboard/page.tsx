"use client";
import TransferModal from "../../components/transfer-modal";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/src/lib/auth-client";
import { FaSpotify } from "react-icons/fa";
import { FaCircleCheck, FaHeart } from "react-icons/fa6";
import NavBar from "../../components/nav-bar";
import { useTransferStore } from "../../store/transfer-store";

type Playlist = {
  id: string;
  name: string;
  images: { url: string }[];
  tracks: { total: number };
};

type LikedSongs = {
  id: string;
  name: string;
  total: number;
};

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loadingPlaylists, setLoadingPlaylists] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { selectedIds, toggleId, clearIds } = useTransferStore();
  const [likedSongs, setLikedSongs] = useState<LikedSongs | null>(null);
  const [showTransferModal, setShowTransferModal] = useState(false);

  useEffect(() => {
    if (!isPending && !session) router.push("/login");
  }, [session, isPending, router]);

  useEffect(() => {
    if (!session) return;

    const fetchAll = async () => {
      try {
        const [playlistsRes, likedRes] = await Promise.all([
          fetch("/api/spotify/playlists"),
          fetch("/api/spotify/liked-songs"),
        ]);

        const [playlistsData, likedData] = await Promise.all([
          playlistsRes.json(),
          likedRes.json(),
        ]);

        if (!playlistsRes.ok) throw new Error(playlistsData.error);
        if (!likedRes.ok) throw new Error(likedData.error);

        setPlaylists(playlistsData.items || []);
        setLikedSongs(likedData);
      } catch (err) {
        console.error(err);
        setError("Could not load your library");
      } finally {
        setLoadingPlaylists(false);
      }
    };

    fetchAll();
  }, [session]);

  if (isPending) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) return null;

  const isLoading = loadingPlaylists;
  const isEmpty = !isLoading && !error && playlists.length === 0 && !likedSongs;

  return (
    <div className="min-h-screen bg-white">
      <NavBar
        userName={session.user?.name || "User"}
        imageUrl={session.user?.image || undefined}
        onSignOut={() =>
          authClient.signOut({
            fetchOptions: { onSuccess: () => router.push("/login") },
          })
        }
      />

      <main className="max-w-5xl mx-auto px-6 py-10 space-y-10 pb-28">
        {/* hero */}
        <div className="space-y-1">
          <h1 className="font-serif text-4xl font-bold text-zinc-950 tracking-tight">
            Your library
          </h1>
          <p className="text-zinc-500 text-sm">
            Select playlists to transfer to another platform
          </p>
        </div>

        {/* transfer cta */}
        <div className="bg-zinc-950 rounded-2xl p-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-white font-medium text-sm">Ready to transfer?</p>
            <p className="text-zinc-400 text-xs mt-0.5">
              Move your playlists from Spotify to Apple Music
            </p>
          </div>
          <button
            // onClick={() => setShowTransferModal(true)}
            className="flex-shrink-0 px-4 py-2 bg-white text-zinc-500 text-sm font-medium rounded-xl cursor-pointer border border-white/10"
          >
            Transfer
          </button>
        </div>

        {/* Library */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-serif text-xl font-bold text-zinc-950">
              Spotify library
            </h2>
            <div className="flex items-center gap-1.5 text-xs text-zinc-400">
              <FaSpotify className="w-3.5 h-3.5 text-green-500" />
              Connected
            </div>
          </div>

          {/* skeletons */}
          {isLoading && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="space-y-2 animate-pulse">
                  <div className="aspect-square bg-zinc-100 rounded-xl" />
                  <div className="h-3 bg-zinc-100 rounded w-3/4" />
                  <div className="h-3 bg-zinc-100 rounded w-1/2" />
                </div>
              ))}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="py-10 text-center text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Empty */}
          {isEmpty && (
            <div className="py-10 text-center text-sm text-zinc-400">
              No playlists found.
            </div>
          )}

          {/* Grid */}
          {!isLoading && !error && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {/* liked songs */}
              {likedSongs &&
                (() => {
                  const isSelected = selectedIds.includes(likedSongs.id);
                  return (
                    <button
                      onClick={() => toggleId(likedSongs.id)}
                      className="group text-left space-y-2"
                    >
                      <div
                        className={`aspect-square rounded-xl relative overflow-hidden transition-all ${
                          isSelected ? "ring-2 ring-zinc-900" : ""
                        }`}
                      >
                        <div className="w-full h-full bg-gradient-to-br from-pink-400 to-purple-600 flex items-center justify-center">
                          <FaHeart className="w-10 h-10 text-white/80" />
                        </div>
                        {isSelected && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <FaCircleCheck className="w-6 h-6 text-white" />
                          </div>
                        )}
                        {!isSelected && (
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
                            <span className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                              Select
                            </span>
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-zinc-900 truncate">
                          {likedSongs.name}
                        </p>
                        <p className="text-xs text-zinc-400">
                          {likedSongs.total} tracks
                        </p>
                      </div>
                    </button>
                  );
                })()}

              {/* playlists */}
              {playlists.map((playlist) => {
                const isSelected = selectedIds.includes(playlist.id);
                return (
                  <button
                    key={playlist.id}
                    onClick={() => toggleId(playlist.id)}
                    className="group text-left space-y-2"
                  >
                    <div
                      className={`aspect-square rounded-xl overflow-hidden bg-zinc-100 relative transition-all ${
                        isSelected ? "ring-2 ring-zinc-900" : ""
                      }`}
                    >
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
                      {isSelected && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-xl">
                          <FaCircleCheck className="w-6 h-6 text-white" />
                        </div>
                      )}
                      {!isSelected && (
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 rounded-xl flex items-center justify-center">
                          <span className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                            Select
                          </span>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-zinc-900 truncate">
                        {playlist.name}
                      </p>
                      <p className="text-xs text-zinc-400">
                        {playlist.tracks?.total} tracks
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* bottom bar */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-0 left-0 w-full border-t border-zinc-100 bg-white ">
          <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
            <p className="text-sm text-zinc-600">
              <span className="font-semibold font-serif text-zinc-950">
                {selectedIds.length}
              </span>{" "}
              {selectedIds.length === 1 ? "playlist" : "playlists"} selected
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={clearIds}
                className="text-sm text-zinc-400 hover:text-zinc-700 transition-colors"
              >
                Clear
              </button>
              <button
                onClick={() => setShowTransferModal(true)}
                className="px-5 py-2 bg-zinc-950 text-white text-sm font-medium rounded-xl hover:bg-zinc-800 transition-colors"
              >
                Transfer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* transfer modal */}

      <TransferModal
        open={showTransferModal}
        onOpenChange={setShowTransferModal}
        playlistCount={selectedIds.length}
        onConfirm={(platform) => {
          console.log("Transfer to:", platform, selectedIds);
        }}
      />
    </div>
  );
}
