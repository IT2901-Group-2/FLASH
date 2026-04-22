import { NextRequest, NextResponse } from "next/server";
import { imageService } from "@/services/imageService";
import { parseRequestBody } from "@/lib/utils/validation";
import { updateImageSchema } from "@/db";
import { errorResponse } from "@/lib/utils/error";
import { withAuth } from "@/lib/utils/withAuth";

export async function GET(
  _: NextRequest,
  { params }: RouteContext<"/api/events/[eventId]/images/[imageId]">
): Promise<NextResponse> {
  const { eventId, imageId } = await params;

  return imageService.downloadImage(eventId, imageId).fold(
    buffer =>
      new NextResponse(new Uint8Array(buffer), {
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

  return withAuth(
    () =>
      parseRequestBody(req, updateImageSchema)
        .map(data => imageService.updateImage(eventId, imageId, data))
        .fold(image => NextResponse.json(image), errorResponse),
    { level: "moderator", eventId }
  );
}

export async function DELETE(
  _: NextRequest,
  { params }: RouteContext<"/api/events/[eventId]/images/[imageId]">
): Promise<NextResponse> {
  const { eventId, imageId } = await params;

  return withAuth(() =>
    imageService
      .deleteImage(eventId, imageId)
      .fold(image => NextResponse.json(image), errorResponse)
  );
}
