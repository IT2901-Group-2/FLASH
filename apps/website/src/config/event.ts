export const TOAST_DISPLAY_TIME =
  parseInt(process.env.NEXT_PUBLIC_TOAST_DISPLAY_TIME ?? "") || 5000;
export const MULTI_FILE_UPLOAD = process.env.NEXT_PUBLIC_MULTI_FILE_UPLOAD === "true";
export const SLIDESHOW_SLIDE_DURATION =
  parseInt(process.env.NEXT_PUBLIC_SLIDESHOW_SLIDE_DURATION ?? "") || 10_000;
