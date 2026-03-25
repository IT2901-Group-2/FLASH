import { getImageSchema, getImagesPageSchema, GetImagesParams, UpdateImage } from "@/db";
import { makeRequest } from "@/lib/utils/api";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import z from "zod";

const imageArraySchema = z.array(getImageSchema);

/**
 * Serializes `GetImages` filters into a URL query string.
 * Returns an empty string when no params are provided.
 *
 * `id` is appended as repeated params (e.g. `?id=a&id=b`) to match how
 * the events hooks serialize array values.
 * `approval` is a single enum string after the zod tuple transform.
 */
function toImagesSearchParams(params?: GetImagesParams): string {
  if (!params) return "";

  const sp = new URLSearchParams();

  if (params.id && params.id.length > 0) {
    params.id
      .slice()
      .sort()
      .forEach(id => sp.append("id", id));
  }
  if (params.approval !== undefined) {
    sp.append("approval", params.approval);
  }
  if (params.cursor !== undefined) {
    sp.append("cursor", params.cursor.toString());
  }
  if (params.pageSize !== undefined) {
    sp.append("pageSize", params.pageSize.toString());
  }

  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

/**
 * Centralized React Query key factory for the images domain.
 *
 * Structure:
 *   imagesKeys.all                    → ["images"]
 *   imagesKeys.event(eventId)         → ["images", eventId]
 *   imagesKeys.list(eventId, params)  → ["images", eventId, "list", "?approval=pending&..."]
 */
export const imagesKeys = {
  all: ["images"] as const,
  event: (eventId?: string) => [...imagesKeys.all, eventId] as const,
  list: (eventId?: string, params?: GetImagesParams) =>
    [...imagesKeys.event(eventId), "list", toImagesSearchParams(params)] as const,
};

/**
 * Fetches event images with cursor pagination for infinite loading.
 */
export function useInfiniteImagesQuery(
  eventId?: string,
  params?: GetImagesParams,
  refetchInterval?: number
) {
  return useInfiniteQuery({
    queryKey: imagesKeys.list(eventId, params),
    initialPageParam: params?.cursor,
    queryFn: ({ pageParam }) =>
      makeRequest(
        getImagesPageSchema,
        `/api/events/${eventId}/images${toImagesSearchParams({
          ...params,
          cursor: pageParam,
        })}`
      ),
    getNextPageParam: lastPage => lastPage.nextCursor ?? undefined,
    enabled: !!eventId,
    refetchInterval,
  });
}

/**
 * Uploads an image to the given event via POST /api/events/:eventId/images.
 * Accepts a `File` or `Blob` and sends it as binary data.
 */
export function useUploadImageMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventId, file }: { eventId: string; file: Blob }) =>
      makeRequest(getImageSchema, `/api/events/${eventId}/images`, "POST", file),
    onSuccess: async (_data, { eventId }) => {
      await queryClient.invalidateQueries({ queryKey: imagesKeys.event(eventId) });
    },
  });
}

/**
 * Partially updates an existing image via PATCH /api/events/:eventId/images/:imageId.
 * Useful for approving/rejecting images or updating other metadata.
 */
export function useUpdateImageMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      eventId,
      imageId,
      data,
    }: {
      eventId: string;
      imageId: string;
      data: UpdateImage;
    }) =>
      makeRequest(
        getImageSchema,
        `/api/events/${eventId}/images/${imageId}`,
        "PATCH",
        data
      ),
    onSuccess: async (_data, { eventId }) => {
      await queryClient.invalidateQueries({ queryKey: imagesKeys.event(eventId) });
    },
  });
}

/**
 * Batch-updates multiple images via PATCH /api/events/:eventId/images.
 * Accepts an array of image IDs and an isApproved flag.
 */
export function useBatchUpdateImageMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      eventId,
      ids,
      isApproved,
    }: {
      eventId: string;
      ids: string[];
      isApproved: boolean;
    }) =>
      makeRequest(imageArraySchema, `/api/events/${eventId}/images`, "PATCH", {
        ids,
        isApproved,
      }),
    onSuccess: async (_data, { eventId }) => {
      await queryClient.invalidateQueries({ queryKey: imagesKeys.event(eventId) });
    },
  });
}

/**
 * Deletes an image via DELETE /api/events/:eventId/images/:imageId.
 */
export function useDeleteImageMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventId, imageId }: { eventId: string; imageId: string }) =>
      makeRequest(getImageSchema, `/api/events/${eventId}/images/${imageId}`, "DELETE"),
    onSuccess: async (_data, { eventId }) => {
      await queryClient.invalidateQueries({ queryKey: imagesKeys.event(eventId) });
    },
  });
}
