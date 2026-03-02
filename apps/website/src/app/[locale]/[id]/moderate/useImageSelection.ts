import { useState, useRef, useCallback } from "react";
import { useUpdateImageMutation } from "@/hooks/useImages";
import type { Image } from "@/db";

export function rectsIntersect(
  a: { left: number; right: number; top: number; bottom: number },
  b: { left: number; right: number; top: number; bottom: number }
): boolean {
  return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
}

const MIN_DRAG_DISTANCE = 2;

export function useImageSelection(images: Image[], eventId: string) {
  const { mutateAsync: updateImage } = useUpdateImageMutation();

  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkError, setBulkError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartPos = useRef<{ x: number; y: number } | null>(null);
  const dragActive = useRef(false);
  const preSelectIds = useRef<Set<string>>(new Set());
  const dragMode = useRef<"select" | "deselect">("select");
  const pointerDownImageId = useRef<string | null>(null);

  const exitSelectMode = useCallback(() => {
    setSelectMode(false);
    setSelectedIds(new Set());
    setBulkError(null);
  }, []);

  const handleSelectToggle = useCallback(() => {
    if (selectMode) exitSelectMode();
    else setSelectMode(true);
  }, [selectMode, exitSelectMode]);

  const handleSelectAll = useCallback(() => {
    setSelectedIds(new Set(images.map(img => img.id)));
  }, [images]);

  const toggleSelection = useCallback((imageId: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (!next.delete(imageId)) {
        next.add(imageId);
      }
      return next;
    });
  }, []);

  const updateSelectionFromBox = useCallback(
    (startX: number, startY: number, currentX: number, currentY: number) => {
      const selRect = {
        left: Math.min(startX, currentX),
        right: Math.max(startX, currentX),
        top: Math.min(startY, currentY),
        bottom: Math.max(startY, currentY),
      };
      const next = new Set(preSelectIds.current);
      images.forEach(image => {
        const el = containerRef.current?.querySelector(`[data-image-id="${image.id}"]`);
        if (!el) return;
        const r = el.getBoundingClientRect();
        if (
          rectsIntersect(selRect, {
            left: r.left,
            right: r.right,
            top: r.top,
            bottom: r.bottom,
          })
        ) {
          if (dragMode.current === "select") {
            next.add(image.id);
          } else {
            next.delete(image.id);
          }
        }
      });
      setSelectedIds(next);
    },
    [images]
  );

  const handleImageClick = useCallback(
    (imageId: string) => {
      if (selectMode) return;
      // TODO: Open image preview when implemented.
      void imageId;
    },
    [selectMode]
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!selectMode) return;
      dragStartPos.current = { x: e.clientX, y: e.clientY };
      dragActive.current = false;
      preSelectIds.current = new Set(selectedIds);
      const el = (e.target as HTMLElement).closest("[data-image-id]");
      const startImageId = el?.getAttribute("data-image-id") ?? null;
      pointerDownImageId.current = startImageId;
      dragMode.current =
        startImageId && selectedIds.has(startImageId) ? "deselect" : "select";
    },
    [selectMode, selectedIds]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragStartPos.current) return;
      const dx = e.clientX - dragStartPos.current.x;
      const dy = e.clientY - dragStartPos.current.y;
      const dist = Math.hypot(dx, dy);
      if (!dragActive.current) {
        if (dist < MIN_DRAG_DISTANCE || Math.abs(dy) > Math.abs(dx) * 2) return;
        dragActive.current = true;
        containerRef.current?.setPointerCapture(e.pointerId);
      }
      updateSelectionFromBox(
        dragStartPos.current.x,
        dragStartPos.current.y,
        e.clientX,
        e.clientY
      );
    },
    [updateSelectionFromBox]
  );

  const handlePointerUp = useCallback(() => {
    if (dragStartPos.current && !dragActive.current && pointerDownImageId.current) {
      toggleSelection(pointerDownImageId.current);
    }
    dragStartPos.current = null;
    dragActive.current = false;
    pointerDownImageId.current = null;
  }, [toggleSelection]);

  const handleBulkAction = useCallback(
    async (isApproved: boolean) => {
      setBulkError(null);
      try {
        await Promise.all(
          Array.from(selectedIds).map(imageId =>
            updateImage({ eventId, imageId, data: { isApproved } })
          )
        );
        exitSelectMode();
      } catch {
        setBulkError("Some photos could not be updated. Please try again.");
      }
    },
    [selectedIds, updateImage, eventId, exitSelectMode]
  );

  const handleBulkApprove = useCallback(() => handleBulkAction(true), [handleBulkAction]);
  const handleBulkReject = useCallback(() => handleBulkAction(false), [handleBulkAction]);

  return {
    // state
    selectMode,
    selectedIds,
    bulkError,
    // refs
    containerRef,
    // handlers
    handleSelectToggle,
    handleSelectAll,
    handleImageClick,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleBulkApprove,
    handleBulkReject,
  };
}
