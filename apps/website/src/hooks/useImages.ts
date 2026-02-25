import { GetImages, Image } from "@/db";
import { fetchJson } from "@/lib/utils/api";
import { useQuery } from "@tanstack/react-query";

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
