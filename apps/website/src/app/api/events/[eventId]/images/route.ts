import { NextRequest, NextResponse } from "next/server";
import { imageService } from "@/services/imageService";
import { Result } from "typescript-result";

export async function GET(
  _: NextRequest,
  { params }: RouteContext<"/api/events/[eventId]/images">
): Promise<NextResponse> {
  const { eventId } = await params;

  return imageService.getImages(eventId).fold(
    images => NextResponse.json(images),
    err => NextResponse.json({ message: err.message }, { status: 500 })
  );
}

export async function POST(
  req: NextRequest,
  { params }: RouteContext<"/api/events/[eventId]/images">
): Promise<NextResponse> {
  const { eventId } = await params;

  return Result.try(() => req.bytes())
    .map(image => imageService.uploadImage(eventId, image))
    .fold(
      image => NextResponse.json(image),
      err => NextResponse.json({ message: err.message }, { status: 500 })
    );
}
