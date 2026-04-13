import { imageService } from "@/services/imageService";
import { errorResponse } from "@/lib/utils/error";
import { NextResponse } from "next/server";

export async function GET(
  _: Request,
  { params }: RouteContext<"/api/events/[eventId]/uploaded">
): Promise<NextResponse> {
  const { eventId } = await params;

  return imageService
    .getUploadedImageCount(eventId)
    .fold(count => NextResponse.json({ count }), errorResponse);
}
