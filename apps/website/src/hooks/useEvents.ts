"use client";

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { makeRequest } from "@/lib/utils/api";
import {
  CreateEvent,
  getEventCodeSchema,
  getEventsPageSchema,
  GetEventCodeParams,
  GetEventsParams,
  getEventSchema,
  UpdateEvent,
} from "@/db";
import z from "zod";

const eventsListResponseSchema = z.union([getEventsPageSchema, z.array(getEventSchema)]);

function toEventsPage(
  response: z.infer<typeof eventsListResponseSchema>
): z.infer<typeof getEventsPageSchema> {
  return Array.isArray(response) ? { items: response, nextCursor: null } : response;
}

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
  if (params.cursor !== undefined) sp.append("cursor", String(params.cursor));
  if (params.pageSize !== undefined) sp.append("pageSize", String(params.pageSize));

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
      makeRequest(
        eventsListResponseSchema,
        `/api/events${toEventsSearchParams(params)}`
      ).then(response => toEventsPage(response).items),
    enabled,
  });
}

/**
 * Fetches events with cursor pagination for infinite scrolling/loading.
 */
export function useInfiniteEventsQuery(
  params?: Omit<GetEventsParams, "cursor" | "pageSize">,
  enabled: boolean = true,
  pageSize: number = 20
) {
  return useInfiniteQuery({
    queryKey: [...eventsKeys.list(params), "infinite", pageSize] as const,
    initialPageParam: undefined as number | undefined,
    queryFn: ({ pageParam }) =>
      makeRequest(
        eventsListResponseSchema,
        `/api/events${toEventsSearchParams({ ...params, cursor: pageParam, pageSize })}`
      ).then(toEventsPage),
    getNextPageParam: lastPage => {
      if (lastPage.nextCursor === null) return undefined;

      const parsed = Number.parseInt(lastPage.nextCursor.toString(), 10);
      return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
    },
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

type JoinErrorCode = "NICKNAME_TAKEN" | "JOIN_FAILED";

/**
 * Converts HTTP response status and payload into a join error code.
 * @param status HTTP response status
 * @param payload HTTP response payload
 * @returns JoinErrorCode
 */
function toJoinErrorCode(status: number, payload: unknown): JoinErrorCode {
  const code =
    payload && typeof payload === "object" && "code" in payload
      ? (payload as { code?: unknown }).code
      : undefined;

  if (status === 409 || code === "NICKNAME_TAKEN") {
    return "NICKNAME_TAKEN";
  }

  return "JOIN_FAILED";
}

/**
 * Submits the join form and returns redirect target on success.
 * Throws error to allow UI-specific translation handling.
 */
export function useJoinMutation() {
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch("/api/join", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        return { redirectUrl: response.url };
      }

      const payload = await response.json().catch(() => null);
      throw new Error(toJoinErrorCode(response.status, payload));
    },
  });
}
