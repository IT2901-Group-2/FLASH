import { imageService } from "@/services/imageService";
import { errorResponse } from "@/lib/utils/error";
import { NextResponse } from "next/server";

export async function GET(
  _: Request,
  { params }: RouteContext<"/api/events/[eventId]/images/mine">
): Promise<NextResponse> {
  const { eventId } = await params;

  return imageService
    .getImagesByUser(eventId)
    .fold(images => NextResponse.json(images), errorResponse);
}
