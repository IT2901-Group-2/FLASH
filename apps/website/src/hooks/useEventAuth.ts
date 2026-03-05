"use client";

import { getCookie } from "cookies-next/client";
import { Result } from "typescript-result";
import jwt from "jsonwebtoken";
import { eventCookieSchema } from "@/db";
import z from "zod";
import { useEffect, useState } from "react";

export type EventAuth =
  | {
      isAuthenticated: false;
      nickname: undefined;
      isModerator: undefined;
    }
  | {
      isAuthenticated: true;
      nickname: string;
      isModerator: boolean;
    };

export function useEventAuth(eventId: string): EventAuth | undefined {
  const [eventAuth, setEventAuth] = useState<EventAuth | undefined>(undefined);

  useEffect(() => {
    Result.try(() => z.parseAsync(z.string(), getCookie(`event-${eventId}`)))
      .map(jwt.decode)
      .mapCatching(c => z.parseAsync(eventCookieSchema, c))
      .fold(
        cookie =>
          setEventAuth({
            isAuthenticated: true,
            nickname: cookie.name,
            isModerator: cookie.isModerator,
          }),
        () =>
          setEventAuth({
            isAuthenticated: false,
            nickname: undefined,
            isModerator: undefined,
          })
      );
  }, [eventCookieSchema, jwt.decode, getCookie, setEventAuth]);

  return eventAuth;
}
