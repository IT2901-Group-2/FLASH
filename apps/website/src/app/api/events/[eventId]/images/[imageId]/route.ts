import { NextRequest, NextResponse } from "next/server";
import { imageService } from "@/services/imageService";

export async function GET(
  _: NextRequest,
  { params }: RouteContext<"/api/events/[eventId]/images/[imageId]">
): Promise<NextResponse> {
  const { eventId, imageId } = await params;

  return imageService.downloadImage(eventId, imageId).fold(
    image =>
      new NextResponse(Buffer.from(image), {
        headers: {
          "Content-Type": "image/webp",
          "Cache-Control": `max-age=${10 * 60 * 60} public`,
        },
      }),
    err => NextResponse.json({ message: err.message }, { status: 500 })
  );
}

export async function DELETE(
  _: NextRequest,
  { params }: RouteContext<"/api/events/[eventId]/images/[imageId]">
): Promise<NextResponse> {
  const { eventId, imageId } = await params;

  return imageService.deleteImage(eventId, imageId).fold(
    image => NextResponse.json(image),
    err => NextResponse.json({ message: err.message }, { status: 500 })
  );
}
