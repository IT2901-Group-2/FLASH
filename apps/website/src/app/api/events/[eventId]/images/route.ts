import { NextRequest, NextResponse } from "next/server";
import { imageService } from "@/services/imageService";
import { Result } from "typescript-result";
import { parseSearchParams } from "@/lib/utils/validation";
import { getImagesParamsSchema } from "@/db";

export async function GET(
  req: NextRequest,
  { params }: RouteContext<"/api/events/[eventId]/images">
): Promise<NextResponse> {
  const { eventId } = await params;

  return parseSearchParams(req.nextUrl.searchParams, getImagesParamsSchema)
    .map(filters => imageService.getImages(eventId, filters))
    .fold(
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
    .map(body => imageService.uploadImage(eventId, body))
    .fold(
      image => NextResponse.json(image),
      err => NextResponse.json({ message: err.message }, { status: 500 })
    );
}
