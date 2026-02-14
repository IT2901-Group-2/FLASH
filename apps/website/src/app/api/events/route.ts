import { dbService } from "@/services/databaseService";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_: NextRequest): Promise<NextResponse> {
  const events = await dbService.getEvents().getOrThrow();

  return NextResponse.json(events);
}

export async function POST(_: NextRequest): Promise<NextResponse> {
  const event = await dbService.createEvent({ name: "eventname" }).getOrThrow();

  return NextResponse.json(event);
}
