import { parseRequestBody } from "@/lib/utils/validation";
import { NextRequest, NextResponse } from "next/server";
import { eventService } from "@/services/eventService";
import { updateEventSchema } from "@/db";
import { errorResponse } from "@/lib/utils/error";
import { withAuth } from "@/lib/utils/withAuth";

export async function PATCH(
  req: NextRequest,
  { params }: RouteContext<"/api/events/[eventId]">
): Promise<NextResponse> {
  const { eventId } = await params;

  return withAuth(() =>
    parseRequestBody(req, updateEventSchema)
      .map(data => eventService.updateEvent(eventId, data))
      .fold(event => NextResponse.json(event), errorResponse)
  );
}

export async function DELETE(
  _: NextRequest,
  { params }: RouteContext<"/api/events/[eventId]">
): Promise<NextResponse> {
  const { eventId } = await params;

  return withAuth(() =>
    eventService
      .deleteEvent(eventId)
      .fold(event => NextResponse.json(event), errorResponse)
  );
}
