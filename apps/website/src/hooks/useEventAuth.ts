import { useGetCookie } from "cookies-next/client";
import { Result } from "typescript-result";
import jwt from "jsonwebtoken";
import { EventCookie, eventCookieSchema } from "@/db";
import z from "zod";

export function useEventAuth(eventId: string): EventCookie | null {
  const getCookie = useGetCookie();

  return Result.try(() => z.parse(z.string(), getCookie(`event-${eventId}`)))
    .map(jwt.decode)
    .map(c => z.parse(eventCookieSchema, c))
    .getOrNull();
}
