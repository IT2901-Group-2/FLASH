import { getImageSchema, getImagesPageSchema, GetImagesParams, UpdateImage } from "@/db";
import { makeRequest } from "@/lib/utils/api";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import z from "zod";

const imageArraySchema = z.array(getImageSchema);
const imagesListResponseSchema = z.union([getImagesPageSchema, imageArraySchema]);

function toImagesPage(
  response: z.infer<typeof imagesListResponseSchema>
): z.infer<typeof getImagesPageSchema> {
  return Array.isArray(response) ? { items: response, nextCursor: null } : response;
}

function toOffsetCursor(cursor?: number): number {
  return cursor ?? 0;
}

/**
 * Converts a response from the images API into a format suitable for infinite scrolling.
 */
function toImagesInfinitePage(
  response: z.infer<typeof imagesListResponseSchema>,
  pageSize: number,
  cursor?: number
): z.infer<typeof getImagesPageSchema> {
  if (!Array.isArray(response)) return response;

  const offset = toOffsetCursor(cursor);
  const items = response.slice(offset, offset + pageSize);
  const nextCursor = offset + pageSize < response.length ? offset + pageSize : null;

  return { items, nextCursor };
}

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
    sp.append("cursor", String(params.cursor));
  }
  if (params.pageSize !== undefined) {
    sp.append("pageSize", String(params.pageSize));
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
 * Fetches a list of images for the given event, optionally filtered by the provided query params.
 */
export function useImagesQuery(
  eventId?: string,
  params?: GetImagesParams,
  refetchInterval?: number
) {
  return useQuery({
    queryKey: imagesKeys.list(eventId, params),
    queryFn: () =>
      makeRequest(
        imagesListResponseSchema,
        `/api/events/${eventId}/images${toImagesSearchParams(params)}`
      ).then(response => toImagesPage(response).items),
    enabled: !!eventId,
    refetchInterval,
  });
}

/**
 * Fetches event images with cursor pagination for infinite loading.
 */
export function useInfiniteImagesQuery(
  eventId?: string,
  params?: Omit<GetImagesParams, "cursor" | "pageSize">,
  pageSize: number = 20,
  refetchInterval?: number
) {
  return useInfiniteQuery({
    queryKey: [...imagesKeys.list(eventId, params), "infinite", pageSize] as const,
    initialPageParam: undefined as number | undefined,
    queryFn: ({ pageParam }) =>
      makeRequest(
        imagesListResponseSchema,
        `/api/events/${eventId}/images${toImagesSearchParams({
          ...params,
          cursor: pageParam,
          pageSize,
        })}`
      ).then(response => toImagesInfinitePage(response, pageSize, pageParam)),
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
