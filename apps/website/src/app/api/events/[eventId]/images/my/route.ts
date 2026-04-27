import { imageService } from "@/services/imageService";
import { errorResponse } from "@/lib/utils/error";
import { NextRequest, NextResponse } from "next/server";
import { parseSearchParams } from "@/lib/utils/validation";
import { getMyImagesParamsSchema } from "@/db";

export async function GET(
  req: NextRequest,
  { params }: RouteContext<"/api/events/[eventId]/images/my">
): Promise<NextResponse> {
  const { eventId } = await params;

  return parseSearchParams(req.nextUrl.searchParams, getMyImagesParamsSchema)
    .map(params => imageService.getImagesByUser(eventId, params))
    .fold(images => NextResponse.json(images), errorResponse);
}
