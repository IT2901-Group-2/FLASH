import { parseRequestBody } from "@/lib/utils/validation";
import { NextRequest, NextResponse } from "next/server";
import { eventService } from "@/services/eventService";
import { createEventSchema } from "@/db";

export async function GET(): Promise<NextResponse> {
  const events = await eventService.getEvents().getOrThrow();

  return NextResponse.json(events);
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  return parseRequestBody(req, createEventSchema)
    .map(data => eventService.createEvent(data))
    .fold(
      event => NextResponse.json(event),
      err => NextResponse.json({ message: err.message }, { status: 500 })
    );
}
