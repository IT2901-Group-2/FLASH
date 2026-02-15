import { parseRequestBody } from "@/lib/utils/validation";
import { NextRequest, NextResponse } from "next/server";
import { eventService } from "@/services/eventService";
import { createEventSchema } from "@/db";

export async function GET(): Promise<NextResponse> {
  return eventService.getEvents().fold(
    events => NextResponse.json(events),
    err => NextResponse.json({ message: err.message }, { status: 500 })
  );
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  return parseRequestBody(req, createEventSchema)
    .map(data => eventService.createEvent(data))
    .fold(
      event => NextResponse.json(event),
      err => NextResponse.json({ message: err.message }, { status: 500 })
    );
}
