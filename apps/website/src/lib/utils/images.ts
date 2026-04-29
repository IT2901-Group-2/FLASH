import { GetImageParams } from "@/db";

/**
 * Constructs a `src` for the specified image.
 *
 * @param eventId The event to fetch the image from.
 * @param imageId The image to fetch.
 * @param params The desired width and height of the image.
 * @returns A URL to the image.
 */
export function getImageSrc(
  eventId: string,
  imageId: string,
  params: GetImageParams = {}
): string {
  const searchParams = new URLSearchParams(
    Object.entries(params).map(obj => obj.map(String))
  );

  const queryString = searchParams.size > 0 ? `?${searchParams.toString()}` : "";

  return `/api/events/${eventId}/images/${imageId}${queryString}`;
}

/**
 * Formats the file too big error message.
 *
 * @param bytes The maximum image size in bytes
 * @returns A formated string
 */
export const formatBytes = (bytes: number): string => {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / 1024 ** 2).toFixed(1)}MB`;
};
