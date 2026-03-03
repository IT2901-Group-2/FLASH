"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { EventDTO, CreateEventInput, UpdateEventInput } from "@/types/eventTypes";
import { fetchJson, toIso } from "@/lib/utils/api";
import { GetEventCode, GetEvents } from "@/db";

/**
 * Serializes an `GetEvents` object into a URL query string (e.g. `?status=active&archived=false`).
 * Returns an empty string when no params are provided.
 */
function toEventsSearchParams(params?: GetEvents): string {
  if (!params) return "";

  const sp = new URLSearchParams();

  const ids = params.id?.slice().sort();
  if (ids && ids.length > 0) ids.forEach(id => sp.append("id", id));
  if (params.name) sp.append("name", params.name);
  if (params.status) sp.append("status", params.status);
  if (params.archived !== undefined) sp.append("archived", params.archived.toString());

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
 *   eventsKeys.code(role)    → ["events", "code", role]
 */

export const eventsKeys = {
  all: ["events"] as const,
  list: (params?: GetEvents) =>
    [...eventsKeys.all, "list", toEventsSearchParams(params)] as const,
  code: (role: GetEventCode["role"]) => [...eventsKeys.all, "code", role] as const,
};

/**
 * Fetches a list of events, optionally filtered by the provided query params.
 */
export function useEventsQuery(params?: GetEvents, enabled = true) {
  return useQuery({
    queryKey: eventsKeys.list(params),
    queryFn: async () => {
      const url = `/api/events${toEventsSearchParams(params)}`;
      return fetchJson<EventDTO[]>(url);
    },
    enabled,
  });
}

/**
 * Fetches the join code of an event. `role` specifies access level.
 */
export function useEventCodeQuery(eventId: string, role: GetEventCode["role"] = "guest") {
  return useQuery({
    queryKey: eventsKeys.code(role),
    queryFn: () => fetchJson<string>(`/api/events/${eventId}/code?role=${role}`),
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
      return fetchJson<EventDTO>("/api/events", {
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
      return fetchJson<EventDTO>(`/api/events/${eventId}`, {
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
