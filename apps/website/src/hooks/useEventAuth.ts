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

export type EventAuthWrapper =
  | {
      isLoading: true;
      eventAuth: undefined;
    }
  | { isLoading: false; eventAuth: EventAuth };

export function useEventAuth(eventId: string): EventAuthWrapper {
  const [eventAuth, setEventAuth] = useState<EventAuthWrapper>({
    isLoading: true,
    eventAuth: undefined,
  });

  useEffect(() => {
    Result.try(() => z.parseAsync(z.string(), getCookie(`event-${eventId}`)))
      .map(jwt.decode)
      .mapCatching(c => z.parseAsync(eventCookieSchema, c))
      .fold(
        cookie =>
          setEventAuth({
            isLoading: false,
            eventAuth: {
              isAuthenticated: true,
              nickname: cookie.name,
              isModerator: cookie.isModerator,
            },
          }),
        () =>
          setEventAuth({
            isLoading: false,
            eventAuth: {
              isAuthenticated: false,
              nickname: undefined,
              isModerator: undefined,
            },
          })
      );
  }, [eventCookieSchema, jwt.decode, getCookie, setEventAuth]);

  return eventAuth;
}
