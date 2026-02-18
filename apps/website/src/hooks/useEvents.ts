"use client";

import { useQuery } from "@tanstack/react-query";
import type { Event } from "@/db";

export type EventsQueryParams = {
  id?: string[];
  name?: string;
  guestCode?: string;
  moderatorCode?: string;
  status?: "upcoming" | "active" | "finished";
  archived?: boolean | "all";
};

export type EventDto = Omit<
  Event,
  "startDate" | "endDate" | "createdAt" | "updatedAt"
> & {
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
};

/*
Creates readable error message from failed HTTP response 
*/
async function readResponseError(res: Response): Promise<string> {
  try {
    const data = (await res.json()) as unknown;
    if (data && typeof data === "object" && "message" in data) {
      const msg = (data as { message?: unknown }).message;
      if (typeof msg === "string" && msg.trim().length > 0) return msg;
    }
  } catch {
    // ignore
  }
  try {
    const text = await res.text();
    if (text.trim().length > 0) return text;
  } catch {
    // ignore
  }
  return `Request failed with status ${res.status}`;
}

/*
Lets caller get a typed result back without casting at the call site
*/
async function fetchJson<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const res = await fetch(input, init);
  if (!res.ok) throw new Error(await readResponseError(res));
  return (await res.json()) as T;
}

/*
Converts an eventQueryParams object into a URL query string
*/
function toEventsSearchParams(params?: EventsQueryParams): string {
  if (!params) return "";

  const sp = new URLSearchParams();

  const ids = params.id?.slice().sort();
  if (ids && ids.length > 0) ids.forEach(id => sp.append("id", id));
  if (params.name) sp.append("name", params.name);
  if (params.guestCode) sp.append("guestCode", params.guestCode);
  if (params.moderatorCode) sp.append("moderatorCode", params.moderatorCode);
  if (params.status) sp.append("status", params.status);
  if (params.archived !== undefined) {
    sp.append(
      "archived",
      params.archived === "all" ? "all" : params.archived ? "true" : "false"
    );
  }

  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

export const eventsKeys = {
  all: ["events"] as const,
  list: (params?: EventsQueryParams) =>
    [...eventsKeys.all, "list", toEventsSearchParams(params)] as const,
};

export function useEventsQuery(params?: EventsQueryParams) {
  return useQuery({
    queryKey: eventsKeys.list(params),
    queryFn: async () => {
      const url = `/api/events${toEventsSearchParams(params)}`;
      return fetchJson<EventDto[]>(url, { cache: "no-store" });
    },
  });
}
