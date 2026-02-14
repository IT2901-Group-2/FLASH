import { eventService } from "@/services/eventService";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_: NextRequest): Promise<NextResponse> {
  const events = await eventService.getEvents().getOrThrow();

  return NextResponse.json(events);
}

export async function POST(_: NextRequest): Promise<NextResponse> {
  const event = await eventService.createEvent({ name: "eventname" }).getOrThrow();

  return NextResponse.json(event);
}
