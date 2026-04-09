import { NextRequest, NextResponse } from "next/server";
import { imageService } from "@/services/imageService";
import { Result } from "typescript-result";
import { parseRequestBody, parseSearchParams } from "@/lib/utils/validation";
import { getImagesParamsSchema, updateImagesSchema } from "@/db";
import { errorResponse, HTTPError } from "@/lib/utils/error";
import { withAuth } from "@/lib/utils/withAuth";
import { verifyAccessToken } from "@/lib/utils/auth";
import { getEventCookie } from "@/lib/utils/eventCookie";
import { JWT_SECRET } from "@/config";
import { eventService } from "@/services/eventService";

export async function GET(
  req: NextRequest,
  { params }: RouteContext<"/api/events/[eventId]/images">
): Promise<NextResponse> {
  const { eventId } = await params;

  const cookie = await getEventCookie(eventId, JWT_SECRET);
  if (!cookie.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { userId, isModerator } = cookie.value;
  const isAdmin = await verifyAccessToken()
    .then(() => true)
    .catch(() => false);
  const isPrivileged = isAdmin || isModerator;

  return eventService
    .getEvents({ id: [eventId] })
    .map(events => {
      const event = events[0];
      if (!event) throw new HTTPError("Event not found", 404);
      return event;
    })
    .fold(
      async event =>
        parseSearchParams(req.nextUrl.searchParams, getImagesParamsSchema).fold(
          async queryParams => {
            const visibleToUserId =
              event.uploadsArePrivate && !isPrivileged ? userId : undefined;

            return imageService
              .getImages(eventId, { ...queryParams, visibleToUserId })
              .fold(images => NextResponse.json(images), errorResponse);
          },
          errorResponse
        ),
      errorResponse
    );
}

export async function PATCH(
  req: NextRequest,
  { params }: RouteContext<"/api/events/[eventId]/images">
): Promise<NextResponse> {
  const { eventId } = await params;

  return withAuth(
    () =>
      parseRequestBody(req, updateImagesSchema)
        .map(({ ids, isApproved }) =>
          imageService.updateImages(eventId, ids, { isApproved })
        )
        .fold(images => NextResponse.json(images), errorResponse),
    { level: "moderator", eventId }
  );
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
