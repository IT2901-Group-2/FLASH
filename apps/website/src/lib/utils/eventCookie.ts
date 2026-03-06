import { AsyncResult, Result } from "typescript-result";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { EventCookie, eventCookieSchema, User } from "@/db";
import z from "zod";
import { JWT_SECRET } from "@/config";

export function getEventCookies(): AsyncResult<EventCookie[], Error> {
  return Result.try(cookies)
    .map(cs => cs.getAll())
    .map(cookies => cookies.filter(cookie => cookie.name.startsWith("event-")))
    .map(cookies =>
      cookies.map(cookie =>
        Result.try(() => jwt.verify(cookie.value, JWT_SECRET)).mapCatching(cookie =>
          z.parseAsync(eventCookieSchema, cookie)
        )
      )
    )
    .map(cookies => Promise.all(cookies))
    .map(cookies => cookies.filter(r => r.ok).map(r => r.value));
}

export function getEventCookie(
  eventId: string,
  secret: string
): AsyncResult<EventCookie, Error> {
  return Result.try(cookies).map(cs =>
    Result.ok(cs.get(`event-${eventId}`)?.value)
      .mapCatching(c => z.parseAsync(z.string(), c))
      .mapCatching(c => z.parseAsync(z.string(), c))
      .mapCatching(c => jwt.verify(c, secret))
      .mapCatching(c => z.parseAsync(eventCookieSchema, c))
  );
}

export function setEventCookie(
  { eventId, id: userId, name, isModerator }: User,
  secret: string
): AsyncResult<void, Error> {
  return Result.try(cookies).map(cs =>
    Result.try(() => jwt.sign({ eventId, userId, name, isModerator }, secret)).map(c => {
      cs.set(`event-${eventId}`, c);
    })
  );
}
