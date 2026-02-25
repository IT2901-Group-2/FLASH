import { GetImages, Image, UpdateImage } from "@/db";
import readResponseError, { fetchJson } from "@/lib/utils/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

/**
 * Serializes `GetImages` filters into a URL query string.
 * Returns an empty string when no params are provided.
 *
 * `id` is appended as repeated params (e.g. `?id=a&id=b`) to match how
 * the events hooks serialize array values.
 * `approval` is a single enum string after the zod tuple transform.
 */
function toImagesSearchParams(params?: GetImages): string {
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
 *   imagesKeys.download(eventId, id)  → ["images", eventId, "download", imageId]
 */
export const imagesKeys = {
  all: ["images"] as const,
  event: (eventId: string) => [...imagesKeys.all, eventId] as const,
  list: (eventId: string, params?: GetImages) =>
    [...imagesKeys.event(eventId), "list", toImagesSearchParams(params)] as const,
  download: (eventId: string, imageId: string) =>
    [...imagesKeys.event(eventId), "download", imageId] as const,
};

/**
 * Fetches a list of images for the given event, optionally filtered by the provided query params.
 */
export function useImagesQuery(eventId: string, params?: GetImages) {
  return useQuery({
    queryKey: imagesKeys.list(eventId, params),
    queryFn: () =>
      fetchJson<Image[]>(`/api/events/${eventId}/images${toImagesSearchParams(params)}`),
    enabled: !!eventId,
  });
}

/**
 * Uploads one or more images to the given event via POST /api/events/:eventId/images.
 * Accepts a `File` or `Blob` and sends it as multipart form data.
 */
export function useUploadImageMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventId, file }: { eventId: string; file: File | Blob }) => {
      const formData = new FormData();
      formData.append("image", file);
      return fetchJson<Image>(`/api/events/${eventId}/images`, {
        method: "POST",
        body: formData,
      });
    },
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
      fetchJson<Image>(`/api/events/${eventId}/images/${imageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
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
      fetchJson<Image>(`/api/events/${eventId}/images/${imageId}`, {
        method: "DELETE",
      }),
    onSuccess: async (_data, { eventId }) => {
      await queryClient.invalidateQueries({ queryKey: imagesKeys.event(eventId) });
    },
  });
}
