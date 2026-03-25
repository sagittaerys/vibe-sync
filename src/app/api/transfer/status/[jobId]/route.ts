import { NextRequest, NextResponse } from "next/server";
import { db } from "@/src/lib/db";
import { transferJobs, transferTracks } from "@/src/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(
  req: NextRequest,
  context: { params: { jobId: string } | Promise<{ jobId: string }> }
) {
  // Ensure we have a synchronous object
  const { jobId } = await Promise.resolve(context.params);

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

  return NextResponse.json({ job, tracks });
}