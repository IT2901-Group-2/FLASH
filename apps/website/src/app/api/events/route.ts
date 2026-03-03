import { parseRequestBody, parseSearchParams } from "@/lib/utils/validation";
import { createEventSchema, getEventsParamsSchema } from "@/db";
import { NextRequest, NextResponse } from "next/server";
import { eventService } from "@/services/eventService";

export async function GET(req: NextRequest): Promise<NextResponse> {
  return parseSearchParams(req.nextUrl.searchParams, getEventsParamsSchema)
    .map(filters => eventService.getEvents(filters))
    .fold(
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
