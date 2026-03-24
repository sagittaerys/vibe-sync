"use client";

import { useState } from "react";
import { FaYoutube } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
// import { FaSpotify } from "react-icons/fa";
import { FaCircleCheck } from "react-icons/fa6";
import { BsAppleMusic } from "react-icons/bs";

type Platform = "apple";

type TransferModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  playlistCount: number;
  onConfirm: (platform: "apple") => void;
};


export default function TransferModal({
  open,
  onOpenChange,
  playlistCount,
  onConfirm,
}: TransferModalProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);

  const handleConfirm = () => {
    if (!selectedPlatform) return;
    onConfirm(selectedPlatform);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white text-zinc-950">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">
            Transfer to
          </DialogTitle>
          <DialogDescription className="text-zinc-500">
            Moving{" "}
            <span className="font-medium text-green-400">
              {playlistCount} {playlistCount === 1 ? "playlist" : "playlists"}
            </span>{" "}
            from Spotify
          </DialogDescription>
         
        </DialogHeader>

        <div className="space-y-2 py-2">
          {/* apple music */}
          <button
            // onClick={() => setSelectedPlatform("apple")}
            className="w-full flex items-center gap-3 p-4 rounded-xl border border-zinc-100 cursor-not-allowed"
          >
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center flex-shrink-0">
              <BsAppleMusic className="text-red-400 w-5 h-5" />
            </div>
            <div className="text-left flex-1">
              <p className="text-sm font-medium text-zinc-300">Apple Music</p>
              <p className="text-xs text-zinc-300">Coming soon</p>
            </div>
              <span className="text-xs bg-zinc-100 text-zinc-400 px-2 py-0.5 rounded-full flex-shrink-0">
              Soon
            </span>
            {selectedPlatform === "apple" && (
              <FaCircleCheck className="w-5 h-5 text-zinc-900 flex-shrink-0" />
            )}
          </button>

          {/* other platforms coming soon */}
          <button
            disabled
            className="w-full flex items-center gap-3 p-4 rounded-xl border border-zinc-100 cursor-not-allowed"
          >
            <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center flex-shrink-0">
              <FaYoutube className="text-red-700 w-5 h-5" />
            </div>
            <div className="text-left flex-1">
              <p className="text-sm font-medium text-zinc-300">YouTube Music</p>
              <p className="text-xs text-zinc-300">Coming soon</p>
            </div>
            <span className="text-xs bg-zinc-100 text-zinc-400 px-2 py-0.5 rounded-full flex-shrink-0">
              Soon
            </span>
          </button>
        </div>

        <DialogFooter className="gap-2 border-none sm:gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1 text-black border-zinc-300 hover:bg-zinc-50 "
          >
            Cancel
          </Button>
          <Button
            disabled={!selectedPlatform}
            onClick={handleConfirm}
            className="flex-1 bg-black border border-zinc-300 text-white  "
          >
            Start transfer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}