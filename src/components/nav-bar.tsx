"use client";
import Link from "next/link";
import { IoIosLogOut } from "react-icons/io";
import Image from "next/image";

type NavBarProps = {
  userName: string;
  imageUrl?: string | null;
  onSignOut: () => void;
};

export default function NavBar({ userName, imageUrl, onSignOut }: NavBarProps) {
  const initial = userName?.[0]?.toUpperCase() || "?";

  return (
    <header className="w-full border-b border-zinc-100 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <nav className="max-w-5xl mx-auto px-4 py-2 flex items-center justify-between">
        {/* Brand */}

        <Link href="/">
          <Image src="/vibe-sync.png" className="border border-red-400" alt="VibeSync" width={170} height={30} />
        </Link>

        {/* details and cta */}
        <div className="flex items-center gap-4">
          {/* details */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-zinc-900 flex items-center justify-center text-white text-xs font-medium">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={userName}
                  className="w-full h-full object-cover"
                />
              ) : (
                initial
              )}
            </div>

            <span className="text-sm text-zinc-700 hidden sm:block">
              {userName}
            </span>
          </div>

          {/* side-line */}
          <div className="hidden sm:block h-4 w-px bg-zinc-200" />

          {/* sign out */}
          <button
            onClick={onSignOut}
            title="Sign out"
            className="text-red-500 transition-colors hover:text-red-700"
          >
            <IoIosLogOut className="w-6 h-6" />
          </button>
        </div>
      </nav>
    </header>
  );
}
