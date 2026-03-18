import { AsyncResult, Result } from "typescript-result";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { EventCookie, eventCookieSchema, User } from "@/db";
import z from "zod";

/**
 * Fetches a list of all available `EventCookies`, ignoring any invalid or malformed cookies.
 *
 * @param secret The secret key the JWT token is signed with.
 * @returns A result containig all valid `EventCookies` or an error.
 */
export function getEventCookies(secret: string): AsyncResult<EventCookie[], Error> {
  return Result.try(cookies)
    .map(cs => cs.getAll())
    .map(cookies => cookies.filter(cookie => cookie.name.startsWith("event-")))
    .map(cookies =>
      cookies.map(cookie =>
        Result.try(() => jwt.verify(cookie.value, secret)).mapCatching(cookie =>
          z.parseAsync(eventCookieSchema, cookie)
        )
      )
    )
    .map(cookies => Promise.all(cookies))
    .map(cookies => cookies.filter(r => r.ok).map(r => r.value));
}

/**
 * Fetches an `EventCookie` for a specific event if it exists, otherwise returns an error.
 *
 * @param eventId
 * @param secret The secret key the JWT token is signed with.
 * @returns A result a valid `EventCookies` for the specified event or an error.
 */
export function getEventCookie(
  eventId: string,
  secret: string
): AsyncResult<EventCookie, Error> {
  return Result.try(cookies).map(cs =>
    Result.ok(cs.get(`event-${eventId}`)?.value)
      .mapCatching(c => z.parseAsync(z.string(), c))
      .mapCatching(c => jwt.verify(c, secret))
      .mapCatching(c => z.parseAsync(eventCookieSchema, c))
  );
}

/**
 * Saves a user session as an `EventCookie`.
 *
 * @param user The user session to save as a cookie.
 * @returns An empty result or an error.
 */
export function setEventCookie(
  {
    eventId,
    id: userId,
    name,
    isModerator,
  }: Pick<User, "eventId" | "id" | "name" | "isModerator">,
  secret: string
): AsyncResult<void, Error> {
  return Result.try(cookies).map(cs =>
    Result.try(() => jwt.sign({ eventId, userId, name, isModerator }, secret)).map(c => {
      cs.set(`event-${eventId}`, c, {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 10 * 24 * 60 * 60,
      });
    })
  );
}
