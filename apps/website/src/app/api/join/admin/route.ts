import { NextRequest, NextResponse } from "next/server";
import { userService } from "@/services/userService";
import { errorResponse } from "@/lib/utils/error";
import { verifyAccessToken } from "@/lib/utils/auth";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    await verifyAccessToken();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { eventId } = body;

  if (!eventId || typeof eventId !== "string") {
    return NextResponse.json({ error: "eventId is required" }, { status: 400 });
  }

  return userService
    .joinEventAsAdmin(eventId)
    .fold(eventId => NextResponse.json({ eventId }), errorResponse);
}
