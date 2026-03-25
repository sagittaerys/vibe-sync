import { db } from "@/src/lib/db";
import { transferJobs, transferTracks } from "@/src/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { jobId: string } }
) {
  try {
    const { jobId } = params;

    
    const job = await db.query.transferJobs.findFirst({
      where: eq(transferJobs.id, jobId),
    });

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

   
    const tracks = await db.query.transferTracks.findMany({
      where: eq(transferTracks.jobId, jobId),
      orderBy: [desc(transferTracks.matchStatus)], 
      limit: 50, 
    });

    return NextResponse.json({
      job,
      tracks,
    });
  } catch (error) {
    console.error("Status API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}