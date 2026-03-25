import { auth } from "@/src/lib/auth";
import { db } from "@/src/lib/db";
import { transferJobs, transferTracks, account } from "@/src/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  const { platform, playlistIds } = await req.json();

  // getting the Spotify Access Token for this user from the 'account' table
  const spotifyAccount = await db.query.account.findFirst({
    where: and(
      eq(account.userId, session.user.id),
      eq(account.providerId, "spotify")
    ),
  });

  if (!spotifyAccount?.accessToken) {
    return NextResponse.json({ error: "Spotify not connected" }, { status: 400 });
  }

  // creating the Job in the database
  const [job] = await db.insert(transferJobs).values({
    userId: session.user.id,
    sourcePlaylistName: "Multiple Playlists", 
    sourcePlatform: "spotify",
    destPlatform: platform,
    status: "running",
  }).returning();

  // triggering the background processing (without waiting for it to finish)
  processSpotifyTransfer(job.id, session.user.id, spotifyAccount.accessToken, playlistIds);

  return NextResponse.json({ jobId: job.id });
}


async function processSpotifyTransfer(jobId: string, userId: string, token: string, playlistIds: string[]) {
  try {
    for (const playlistId of playlistIds) {
      // fetching tracks from Spotify API for each playlist
      const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      
      const tracks = data.items || [];
      
    //  inserting each track into the transferTracks table with matchStatus "pending"
      for (let i = 0; i < tracks.length; i++) {
        const t = tracks[i].track;
        await db.insert(transferTracks).values({
          jobId: jobId,
          sourceTrackId: t.id,
          sourceTitle: t.name,
          sourceArtist: t.artists[0].name,
          position: i,
          matchStatus: "pending"
        });
      }
    }
    
    // after processing all playlists, update the job status to "completed" 
  } catch (error) {
    console.error("Transfer failed:", error);
    await db.update(transferJobs).set({ status: "failed" }).where(eq(transferJobs.id, jobId));
  }
}