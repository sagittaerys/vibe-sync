"use client";

import { FaSpotify, FaSoundcloud } from "react-icons/fa";
import { BsAppleMusic } from "react-icons/bs";
import { FaDeezer } from "react-icons/fa6";
import { FaYoutube } from "react-icons/fa";

const platforms = [
  {
    icon: <FaSpotify className="w-3.5 h-3.5 text-green-400" />,
    label: "Spotify",
  },
  {
    icon: <BsAppleMusic className="w-3.5 h-3.5 text-red-400" />,
    label: "Apple Music",
  },
  {
    icon: <FaDeezer className="w-3.5 h-3.5 text-purple-400" />,
    label: "Deezer",
  },
  {
    icon: <FaYoutube className="w-3.5 h-3.5 text-red-600" />,
    label: "YouTube Music",
  },
  {
    icon: <FaSoundcloud className="w-3.5 h-3.5 text-orange-500" />,
    label: "SoundCloud",
  },
];

export default function PlatformMarquee() {
  const items = [...platforms, ...platforms]; 

  return (
    <>
      <style>{`
        @keyframes marquee-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track {
          animation: marquee-scroll 20s linear infinite;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div
        className="overflow-hidden w-full"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
        }}
      >
        <div className="marquee-track flex items-center gap-2 w-max">
          {items.map((p, i) => (
            <div key={i} className="flex items-center gap-2 flex-shrink-0">
              <div className="flex items-center gap-2 px-2 py-1.5 bg-white border border-white/10 rounded-full">
                {p.icon}
                <span className="text-zinc-900 text-xs font-medium">
                  {p.label}
                </span>
              </div>
              <span className="text-zinc-600 text-xs">↔</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}