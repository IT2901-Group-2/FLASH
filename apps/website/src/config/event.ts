export const TOAST_DISPLAY_TIME = parseInt(process.env.TOAST_DISPLAY_TIME ?? "") || 5000;
export const MULTI_FILE_UPLOAD = Boolean(process.env.MULTI_FILE_UPLOAD) ?? false;
export const SLIDESHOW_SLIDE_DURATION =
  parseInt(process.env.SLIDESHOW_SLIDE_DURATION ?? "") ?? 10_000;
