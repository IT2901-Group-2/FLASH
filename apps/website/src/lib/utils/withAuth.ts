import { NextResponse } from "next/server";
import { verifyAccessToken } from "./auth";
import { verifyModerator } from "./eventCookie";

type AuthLevel = "admin" | "moderator";

export async function withAuth(
  handler: () => Promise<NextResponse>,
  opts?: { level?: AuthLevel; eventId?: string }
) {
  const { level = "admin", eventId } = opts ?? {};

  const isAdmin = await verifyAccessToken()
    .then(() => true)
    .catch(() => false);
  if (isAdmin) return handler();

  if (level === "moderator" && eventId) {
    const isModerator = await verifyModerator(eventId);
    if (isModerator) return handler();
  }

  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
