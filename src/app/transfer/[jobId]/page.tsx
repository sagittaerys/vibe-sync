"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FaCircleCheck, FaSpinner, FaYoutube, FaSpotify } from "react-icons/fa6";
import { Progress } from "@/src/components/ui/progress"; 

type TransferJob = {
  id: string;
  status: string;
  totalTracks: number;
  sourcePlatform: string;
  destPlatform: string;
};

type TrackMatch = {
  id: string;
  sourceTitle: string;
  sourceArtist: string;
  matchStatus: "pending" | "exact" | "fuzzy" | "vibe" | "not_found";
};

export default function TransferStatusPage() {
  const { jobId } = useParams();
  const [job, setJob] = useState<TransferJob | null>(null);
  const [tracks, setTracks] = useState<TrackMatch[]>([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchStatus = async () => {
      const res = await fetch(`/api/transfer/status/${jobId}`);
      const data = await res.json();
      
      setJob(data.job);
      setTracks(data.tracks);

      // progress percentage
      const completed = data.tracks.filter((t: any) => t.matchStatus !== "pending").length;
      const total = data.job.totalTracks || data.tracks.length;
      setProgress(total > 0 ? (completed / total) * 100 : 0);

    // if job is completed or failed, stop polling
      if (data.job.status === "completed" || data.job.status === "failed") {
        clearInterval(pollInterval);
      }
    };

    fetchStatus();
    const pollInterval = setInterval(fetchStatus, 3000); 

    return () => clearInterval(pollInterval);
  }, [jobId]);

  if (!job) return <div className="p-10 text-center animate-pulse font-serif">Initializing vibe engine...</div>;

  return (
    <div className="min-h-screen bg-white text-zinc-950 p-6 md:p-10">
      <div className="max-w-2xl mx-auto space-y-8">
        
        {/* header */}
        <div className="text-center space-y-2">
          <h1 className="font-serif text-3xl font-bold italic">VibeSyncing...</h1>
          <p className="text-zinc-500 text-sm">
            Moving your sounds from <span className="capitalize">{job.sourcePlatform}</span> to <span className="capitalize">{job.destPlatform}</span>
          </p>
        </div>

        {/* Progress Visual */}
        <div className="bg-zinc-50 border border-zinc-100 rounded-2xl p-8 space-y-6">
          <div className="flex justify-between items-end">
            <div className="flex gap-4 items-center">
               <FaSpotify className="text-green-500 w-6 h-6" />
               <div className="h-px w-12 bg-zinc-200 border-t border-dashed" />
               <FaYoutube className="text-red-600 w-6 h-6" />
            </div>
            <span className="font-mono text-sm font-bold">{Math.round(progress)}%</span>
          </div>
          
          <Progress value={progress} className="h-2 bg-zinc-200" />
          
          <p className="text-xs text-center text-zinc-400 font-medium tracking-widest uppercase">
            {job.status === "completed" ? "Transfer Complete" : "AI is analyzing track metadata"}
          </p>
        </div>

        {/* real-time track list */}
        <div className="space-y-3">
          <h3 className="font-serif font-bold text-lg">Recent Matches</h3>
          <div className="space-y-2">
            {tracks.slice(0, 5).map((track) => (
              <div key={track.id} className="flex items-center justify-between p-4 rounded-xl border border-zinc-100 bg-white">
                <div className="flex flex-col">
                  <span className="text-sm font-medium truncate w-48">{track.sourceTitle}</span>
                  <span className="text-xs text-zinc-400">{track.sourceArtist}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  {track.matchStatus === "pending" ? (
                    <FaSpinner className="animate-spin text-zinc-300 w-4 h-4" />
                  ) : (
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-zinc-50 rounded-lg border border-zinc-100">
                       <span className="text-[10px] font-bold uppercase tracking-tighter text-zinc-500">
                         {track.matchStatus} match
                       </span>
                       <FaCircleCheck className="text-green-500 w-3 h-3" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}