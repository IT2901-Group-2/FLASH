import { parseSearchParams } from "@/lib/utils/validation";
import { getEventCodeParamsSchema } from "@/db";
import { NextRequest, NextResponse } from "next/server";
import { eventService } from "@/services/eventService";
import { errorResponse } from "@/lib/utils/error";
import { withAuth } from "@/lib/utils/withAuth";

export async function GET(
  req: NextRequest,
  { params }: RouteContext<"/api/events/[eventId]/code">
): Promise<NextResponse> {
  const { eventId } = await params;

  return withAuth(
    () =>
      parseSearchParams(req.nextUrl.searchParams, getEventCodeParamsSchema)
        .map(data => eventService.getEventCode(eventId, data))
        .fold(events => NextResponse.json(events), errorResponse),
    { level: "moderator", eventId }
  );
}
