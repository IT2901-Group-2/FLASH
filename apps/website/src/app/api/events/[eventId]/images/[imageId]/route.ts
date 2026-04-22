import { NextRequest, NextResponse } from "next/server";
import { imageService } from "@/services/imageService";
import { parseRequestBody, parseSearchParams } from "@/lib/utils/validation";
import { getImageParamsSchema, updateImageSchema } from "@/db";
import { errorResponse } from "@/lib/utils/error";

export async function GET(
  req: NextRequest,
  { params }: RouteContext<"/api/events/[eventId]/images/[imageId]">
): Promise<NextResponse> {
  const { eventId, imageId } = await params;

  return parseSearchParams(req.nextUrl.searchParams, getImageParamsSchema)
    .map(params => imageService.downloadImage(eventId, imageId, params))
    .fold(
      image =>
        new NextResponse(Buffer.from(image), {
          headers: {
            "Content-Type": "image/webp",
            "Cache-Control": `public, max-age=${10 * 60 * 60}`,
          },
        }),
      errorResponse
    );
}

export async function PATCH(
  req: NextRequest,
  { params }: RouteContext<"/api/events/[eventId]/images/[imageId]">
): Promise<NextResponse> {
  const { eventId, imageId } = await params;

  return parseRequestBody(req, updateImageSchema)
    .map(data => imageService.updateImage(eventId, imageId, data))
    .fold(image => NextResponse.json(image), errorResponse);
}

export async function DELETE(
  _: NextRequest,
  { params }: RouteContext<"/api/events/[eventId]/images/[imageId]">
): Promise<NextResponse> {
  const { eventId, imageId } = await params;

  return imageService
    .deleteImage(eventId, imageId)
    .fold(image => NextResponse.json(image), errorResponse);
}
