import { auth } from "@/src/lib/auth"; 
import { db } from "@/src/lib/db";     
import { account } from "@/src/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const provider = searchParams.get("provider");

  if (!provider) {
    return NextResponse.json({ error: "No provider specified" }, { status: 400 });
  }

  
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ isLinked: false, error: "Unauthorized" }, { status: 401 });
  }

  
  const linkedAccount = await db.query.account.findFirst({
    where: and(
      eq(account.userId, session.user.id),
      eq(account.providerId, provider)
    ),
  });

  return NextResponse.json({ isLinked: !!linkedAccount });
}