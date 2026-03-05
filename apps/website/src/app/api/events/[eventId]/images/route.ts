import { NextRequest, NextResponse } from "next/server";
import { imageService } from "@/services/imageService";
import { Result } from "typescript-result";
import { parseRequestBody, parseSearchParams } from "@/lib/utils/validation";
import { getImagesParamsSchema } from "@/db";
import { BATCH_IMAGE_LIMIT } from "@/config";
import { errorResponse } from "@/lib/utils/error";
import z from "zod";

export async function GET(
  req: NextRequest,
  { params }: RouteContext<"/api/events/[eventId]/images">
): Promise<NextResponse> {
  const { eventId } = await params;

  return parseSearchParams(req.nextUrl.searchParams, getImagesParamsSchema)
    .map(filters => imageService.getImages(eventId, filters))
    .fold(images => NextResponse.json(images), errorResponse);
}

const batchUpdateSchema = z.object({
  ids: z.string().array().max(BATCH_IMAGE_LIMIT),
  isApproved: z.boolean(),
});

export async function PATCH(
  req: NextRequest,
  { params }: RouteContext<"/api/events/[eventId]/images">
): Promise<NextResponse> {
  const { eventId } = await params;

  return parseRequestBody(req, batchUpdateSchema)
    .map(({ ids, isApproved }) =>
      imageService.updateImages(eventId, ids, { isApproved })
    )
    .fold(images => NextResponse.json(images), errorResponse);
}

export async function POST(
  req: NextRequest,
  { params }: RouteContext<"/api/events/[eventId]/images">
): Promise<NextResponse> {
  const { eventId } = await params;

  return Result.try(() => req.bytes())
    .map(body => imageService.uploadImage(eventId, body))
    .fold(image => NextResponse.json(image), errorResponse);
}
