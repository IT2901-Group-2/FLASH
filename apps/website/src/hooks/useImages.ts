import {
  getImageSchema,
  GetImagesParams,
  UpdateImage,
  uploadedImageCountSchema,
} from "@/db";
import readResponseError, { makeRequest } from "@/lib/utils/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import z from "zod";

const imageArraySchema = z.array(getImageSchema);

export type CreateImageInput = {
  eventId: string;
  file: Blob;
};

export type UpdateImageInput = {
  eventId: string;
  imageId: string;
  data: UpdateImage;
};

export type DeleteImageInput = { eventId: string; imageId: string };

export type BatchUpdateImageInput = {
  eventId: string;
  ids: string[];
  isApproved: boolean;
};

export type DownloadImagesInput = {
  eventId: string;
};

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
  uploaded: (eventId?: string) => [...imagesKeys.event(eventId), "uploaded"] as const,
  my: (eventId?: string) => [...imagesKeys.event(eventId), "my"] as const,
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
        imageArraySchema,
        `/api/events/${eventId}/images${toImagesSearchParams(params)}`
      ),
    enabled: !!eventId,
    refetchInterval,
  });
}

/**
 * Fetches all images uploaded by the currently authenticated event user,
 * regardless of approval status.
 */
export function useMyImagesQuery(
  eventId?: string,
  enabled = true,
  refetchInterval?: number
) {
  return useQuery({
    queryKey: imagesKeys.my(eventId),
    queryFn: () => makeRequest(imageArraySchema, `/api/events/${eventId}/images/my`),
    enabled: !!eventId && enabled,
    refetchInterval,
  });
}

/**
 * Fetches the uploaded image count for the currently authenticated event user.
 */
export function useUploadedImageCountQuery(eventId?: string) {
  return useQuery({
    queryKey: imagesKeys.uploaded(eventId),
    queryFn: () =>
      makeRequest(uploadedImageCountSchema, `/api/events/${eventId}/uploaded`),
    enabled: !!eventId,
  });
}

/**
 * Uploads an image to the given event via POST /api/events/:eventId/images.
 * Accepts a `File` or `Blob` and sends it as binary data.
 */
export function useUploadImageMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventId, file }: CreateImageInput) =>
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
    mutationFn: ({ eventId, imageId, data }: UpdateImageInput) =>
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
    mutationFn: ({ eventId, ids, isApproved }: BatchUpdateImageInput) =>
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
    mutationFn: ({ eventId, imageId }: DeleteImageInput) =>
      makeRequest(getImageSchema, `/api/events/${eventId}/images/${imageId}`, "DELETE"),
    onSuccess: async (_data, { eventId }) => {
      await queryClient.invalidateQueries({ queryKey: imagesKeys.event(eventId) });
    },
  });
}

/**
 * Downloads all images for the given event as a zip file.
 */
export function useDownloadImagesMutation() {
  return useMutation({
    mutationFn: async ({ eventId }: DownloadImagesInput) => {
      const response = await fetch(`/api/events/${eventId}/images/download`);
      if (!response.ok) {
        throw new Error(await readResponseError(response));
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.click();
      URL.revokeObjectURL(url);
    },
  });
}
