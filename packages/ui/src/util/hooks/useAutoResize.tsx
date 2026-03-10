import { useCallback } from "react";

export const useAutoResize = (
  ref: React.RefObject<HTMLTextAreaElement | null>,
  minRows?: number,
  maxRows?: number
) => {
  const resize = useCallback(() => {
    const el = ref.current;
    if (!el) return;

    const lineHeight = parseFloat(getComputedStyle(el).lineHeight) + 7;

    if (minRows !== undefined) el.style.minHeight = `${minRows * lineHeight}px`;
    if (maxRows !== undefined) el.style.maxHeight = `${maxRows * lineHeight}px`;

    el.style.height = "0";
    el.style.height = `${el.scrollHeight}px`;
  }, [ref, minRows, maxRows]);

  return resize;
};
