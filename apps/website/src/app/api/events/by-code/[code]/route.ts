import { NextRequest, NextResponse } from "next/server";
import { eventService } from "@/services/eventService";
import { errorResponse } from "@/lib/utils/error";
import { withAuth } from "@/lib/utils/withAuth";

export async function GET(
  _: NextRequest,
  { params }: RouteContext<"/api/events/by-code/[code]">
): Promise<NextResponse> {
  const { code } = await params;

  return eventService
    .getEventByCode(code)
    .fold(events => NextResponse.json(events), errorResponse);
}
