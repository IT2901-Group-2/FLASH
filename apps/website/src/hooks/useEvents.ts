"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "@/lib/utils/api";
import {
  CreateEvent,
  getEventCodeSchema,
  GetEventCodeParams,
  GetEventsParams,
  getEventSchema,
  UpdateEvent,
} from "@/db";
import z from "zod";

/**
 * Serializes an `GetEvents` object into a URL query string (e.g. `?status=active&archived=false`).
 * Returns an empty string when no params are provided.
 */
function toEventsSearchParams(params?: GetEventsParams): string {
  if (!params) return "";

  const sp = new URLSearchParams();

  const ids = params.id?.slice().sort();
  if (ids && ids.length > 0) ids.forEach(id => sp.append("id", id));
  if (params.name) sp.append("name", params.name);
  if (params.status) sp.append("status", params.status);
  if (params.archived !== undefined) sp.append("archived", params.archived.toString());
  if (params.sortBy !== undefined) sp.append("sortBy", params.sortBy);
  if (params.order !== undefined) sp.append("order", params.order);

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
 *   eventsKeys.all                 → ["events"]
 *   eventsKeys.list(params)        → ["events", "list", "?status=active&..."]
 *   eventsKeys.code(eventId, role) → ["events", eventId, "code", role]
 */

export const eventsKeys = {
  all: ["events"] as const,
  list: (params?: GetEventsParams) =>
    [...eventsKeys.all, "list", toEventsSearchParams(params)] as const,
  code: (eventId?: string, role: GetEventCodeParams["role"] = "guest") =>
    [...eventsKeys.all, eventId, "code", role] as const,
  byCode: (code?: string) => [...eventsKeys.all, "by-code", code] as const,
};

/**
 * Fetches a list of events, optionally filtered by the provided query params.
 */
export function useEventsQuery(params?: GetEventsParams, enabled: boolean = true) {
  return useQuery({
    queryKey: eventsKeys.list(params),
    queryFn: () =>
      makeRequest(z.array(getEventSchema), `/api/events${toEventsSearchParams(params)}`),
    enabled,
  });
}

/**
 * Fetches the join code of an event. `role` specifies access level.
 */
export function useEventCodeQuery(
  eventId?: string,
  role: GetEventCodeParams["role"] = "guest"
) {
  return useQuery({
    queryKey: eventsKeys.code(eventId, role),
    queryFn: () => makeRequest(z.string(), `/api/events/${eventId}/code?role=${role}`),
    enabled: !!eventId,
  });
}

/**
 * Resolves join code metadata for the event joining flow.
 */
export function useEventByCodeQuery(code?: string) {
  return useQuery({
    queryKey: eventsKeys.byCode(code),
    queryFn: () => makeRequest(getEventCodeSchema, `/api/events/by-code/${code}`),
    enabled: !!code,
  });
}

/**
 * Creates a new event via POST /api/events.
 * Date fields are normalized to ISO strings before sending.
 */
export function useCreateEventMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateEvent) =>
      makeRequest(getEventSchema, "/api/events", "POST", input),
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
    mutationFn: ({ eventId, data }: { eventId: string; data: UpdateEvent }) =>
      makeRequest(getEventSchema, `/api/events/${eventId}`, "PATCH", data),
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
    mutationFn: ({ eventId }: { eventId: string }) =>
      makeRequest(getEventSchema, `/api/events/${eventId}`, "DELETE"),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: eventsKeys.all });
    },
  });
}
