import { NextRequest, NextResponse } from "next/server";
import { imageService } from "@/services/imageService";
import { Result } from "typescript-result";
import { parseRequestBody, parseSearchParams } from "@/lib/utils/validation";
import { getImagesParamsSchema, updateImagesSchema } from "@/db";
import { errorResponse } from "@/lib/utils/error";

export async function GET(
  req: NextRequest,
  { params }: RouteContext<"/api/events/[eventId]/images">
): Promise<NextResponse> {
  const { eventId } = await params;

  return parseSearchParams(req.nextUrl.searchParams, getImagesParamsSchema)
    .map(filters => imageService.getImages(eventId, filters))
    .fold(page => NextResponse.json(page), errorResponse);
}

export async function PATCH(
  req: NextRequest,
  { params }: RouteContext<"/api/events/[eventId]/images">
): Promise<NextResponse> {
  const { eventId } = await params;

  return parseRequestBody(req, updateImagesSchema)
    .map(({ ids, isApproved }) => imageService.updateImages(eventId, ids, { isApproved }))
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
