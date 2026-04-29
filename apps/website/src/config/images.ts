export const BATCH_IMAGE_LIMIT = 100;

export const MAX_IMAGE_SIZE =
  parseInt(process.env.MAX_IMAGE_SIZE ?? "") || 12 * 1024 * 1024;

export const EVENT_REFETCH_INTERVAL =
  parseInt(process.env.NEXT_PUBLIC_EVENT_REFETCH_INTERVAL ?? "") || 120_000;
export const PHOTOS_REFETCH_INTERVAL =
  parseInt(process.env.NEXT_PUBLIC_PHOTOS_REFETCH_INTERVAL ?? "") || 12_000;
