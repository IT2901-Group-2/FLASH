import { NextRequest, NextResponse } from "next/server";
import { imageService } from "@/services/imageService";
import { parseRequestBody } from "@/lib/utils/validation";
import { updateImageSchema } from "@/db";
import { errorResponse } from "@/lib/utils/error";
import { withAuth } from "@/lib/utils/withAuth";
import { eventService } from "@/services/eventService";
import { verifyAccessToken } from "@/lib/utils/auth";
import { getEventCookie } from "@/lib/utils/eventCookie";
import { JWT_SECRET } from "@/config";

export async function GET(
  _: NextRequest,
  { params }: RouteContext<"/api/events/[eventId]/images/[imageId]">
): Promise<NextResponse> {
  const { eventId, imageId } = await params;

  const cookie = await getEventCookie(eventId, JWT_SECRET);

  if (!cookie.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { userId, isModerator } = cookie.value;
  const isAdmin = await verifyAccessToken()
    .then(() => true)
    .catch(() => false);
  const isPrivileged = isAdmin || isModerator;

  return eventService.getEvent(eventId).fold(async event => {
    const visibleToUserId = event.uploadsArePrivate && !isPrivileged ? userId : undefined;

    return imageService
      .downloadImage(eventId, imageId, { visibleToUserId })
      .fold(buffer => new NextResponse(new Uint8Array(buffer)), errorResponse);
  }, errorResponse);
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
