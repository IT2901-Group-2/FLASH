"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  EventsQueryParams,
  EventDto,
  CreateEventInput,
  UpdateEventInput,
} from "@/types/eventTypes";

/**
 * Normalizes a date value to an ISO 8601 string for API serialization.
 * Returns undefined if no value is provided.
 */
function toIso(value?: Date): string | undefined {
  if (value === undefined) return undefined;
  return value instanceof Date ? value.toISOString() : value;
}

/**
 * Attempts to extract a human-readable error message from a failed HTTP response.
 * Tries to parse a JSON body first (looking for a `message` field), then falls
 * back to plain text, and finally falls back to a generic status-code message.
 */
async function readResponseError(res: Response): Promise<string> {
  try {
    const data = await res.clone().json();
    if (data && typeof data === "object" && "message" in data) {
      const msg = (data as { message?: unknown }).message;
      if (typeof msg === "string" && msg.trim()) return msg;
    }
  } catch {
    // ignore
  }
  try {
    const text = await res.clone().text();
    if (text.trim()) return text;
  } catch {
    // ignore
  }
  return `Request failed with status ${res.status} ${res.statusText}`;
}

/**
 * Wrapper around `fetch` that throws a descriptive error on non-2xx
 * responses and returns the parsed JSON body typed as `T`, avoiding
 * repetitive error handling and type casting at every call site.
 */
async function fetchJson<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const res = await fetch(input, init);
  if (!res.ok) throw new Error(await readResponseError(res));
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

/**
 * Serializes an `EventsQueryParams` object into a URL query string (e.g. `?status=active&archived=false`).
 * Returns an empty string when no params are provided.
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

/**
 * Centralized React Query key factory for the events domain.
 * Using a shared factory keeps cache invalidation predictable — calling
 * `invalidateQueries({ queryKey: eventsKeys.all })` will bust every
 * events-related query in one go.
 *
 * Structure:
 *   eventsKeys.all           → ["events"]
 *   eventsKeys.list(params)  → ["events", "list", "?status=active&..."]
 */

export const eventsKeys = {
  all: ["events"] as const,
  list: (params?: EventsQueryParams) =>
    [...eventsKeys.all, "list", toEventsSearchParams(params)] as const,
};

/**
 * Fetches a list of events, optionally filtered by the provided query params.
 */
export function useEventsQuery(params?: EventsQueryParams) {
  return useQuery({
    queryKey: eventsKeys.list(params),
    queryFn: async () => {
      const url = `/api/events${toEventsSearchParams(params)}`;
      return fetchJson<EventDto[]>(url);
    },
  });
}

/**
 * Creates a new event via POST /api/events.
 * Date fields are normalized to ISO strings before sending.
 */
export function useCreateEventMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateEventInput) => {
      return fetchJson<EventDto>("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...input,
          startDate: toIso(input.startDate),
          endDate: toIso(input.endDate),
        }),
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: eventsKeys.all });
    },
  });
}

/**
 * Partially updates an existing event via PATCH /api/events/:eventId.
 * Only the fields present in `data` are sent; omitted fields are left unchanged.
 * Date fields are normalized to ISO strings before sending.
 */
export function useUpdateEventMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventId, data }: { eventId: string; data: UpdateEventInput }) => {
      return fetchJson<EventDto>(`/api/events/${eventId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          startDate: toIso(data.startDate),
          endDate: toIso(data.endDate),
        }),
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: eventsKeys.all });
    },
  });
}

/**
 * Deletes an event via DELETE /api/events/:eventId.
 */
export function useDeleteEventMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventId }: { eventId: string }) => {
      return fetchJson<unknown>(`/api/events/${eventId}`, { method: "DELETE" });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: eventsKeys.all });
    },
  });
}
