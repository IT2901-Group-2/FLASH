import { updateEventSchema } from "@/db";
import { parseRequestBody } from "@/lib/request";
import { eventService } from "@/services/eventService";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: RouteContext<"/api/events/[eventId]">
): Promise<NextResponse> {
  const { eventId } = await params;

  return parseRequestBody(req, updateEventSchema)
    .map(data => eventService.updateEvent(eventId, data))
    .fold(
      event => NextResponse.json(event),
      err => NextResponse.json({ message: err.message }, { status: 500 })
    );
}

export async function DELETE(
  _: NextRequest,
  { params }: RouteContext<"/api/events/[eventId]">
): Promise<NextResponse> {
  const { eventId } = await params;

  return eventService.deleteEvent(eventId).fold(
    () => new NextResponse(null, { status: 200 }),
    err => NextResponse.json({ message: err.message }, { status: 500 })
  );
}
