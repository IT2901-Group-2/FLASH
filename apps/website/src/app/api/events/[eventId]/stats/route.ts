import { errorResponse } from "@/lib/utils/error";
import { eventService } from "@/services/eventService";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _: NextRequest,
  { params }: RouteContext<"/api/events/[eventId]/stats">
): Promise<NextResponse> {
  const { eventId } = await params;

  return eventService.getEventStats(eventId).fold(NextResponse.json, errorResponse);
}
