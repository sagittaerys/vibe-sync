import { NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { db } from "@/src/lib/db";
import { account } from "@/src/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(request: Request) {
  try {
   
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

  
    const spotifyAccount = await db
      .select()
      .from(account)
      .where(
        and(
          eq(account.userId, session.user.id),
          eq(account.providerId, "spotify")
        )
      )
      .limit(1);

    if (!spotifyAccount.length) {
      return NextResponse.json(
        { error: "Spotify account not linked" },
        { status: 404 }
      );
    }

    const accessToken = spotifyAccount[0].accessToken;

    if (!accessToken) {
      return NextResponse.json(
        { error: "No access token found" },
        { status: 400 }
      );
    }

   
    const response = await fetch(
      "https://api.spotify.com/v1/me/playlists?limit=50",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch playlists" },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Spotify playlists error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}