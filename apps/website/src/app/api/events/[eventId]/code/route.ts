import { parseSearchParams } from "@/lib/utils/validation";
import { getEventCodeSchema } from "@/db";
import { NextRequest, NextResponse } from "next/server";
import { eventService } from "@/services/eventService";

export async function GET(
  req: NextRequest,
  { params }: RouteContext<"/api/events/[eventId]/code">
): Promise<NextResponse> {
  const { eventId } = await params;

  return parseSearchParams(req.nextUrl.searchParams, getEventCodeSchema)
    .map(data => eventService.getEventCode(eventId, data))
    .fold(
      events => NextResponse.json(events),
      err => NextResponse.json({ message: err.message }, { status: 500 })
    );
}
