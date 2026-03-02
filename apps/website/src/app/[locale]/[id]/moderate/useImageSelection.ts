import { useState, useRef, useCallback } from "react";
import { useUpdateImageMutation } from "@/hooks/useImages";
import type { Image } from "@/db";

export function useImageSelection(images: Image[], eventId: string) {
  const { mutateAsync: updateImage } = useUpdateImageMutation();

  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkError, setBulkError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const draggedOver = useRef<Set<string>>(new Set());

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
      next.has(imageId) ? next.delete(imageId) : next.add(imageId);
      return next;
    });
  }, []);

  const addToSelection = useCallback((imageId: string) => {
    setSelectedIds(prev => {
      if (prev.has(imageId)) return prev;
      const next = new Set(prev);
      next.add(imageId);
      return next;
    });
  }, []);

  const handleImageClick = useCallback(
    (imageId: string) => {
      if (selectMode) {
        toggleSelection(imageId);
      } else {
        // TODO: Open image preview when implemented.
      }
    },
    [selectMode, toggleSelection]
  );

  const toggleImageUnderPointer = useCallback(
    (x: number, y: number) => {
      const el = document.elementFromPoint(x, y)?.closest("[data-image-id]");
      const imgId = el?.getAttribute("data-image-id");
      if (imgId && !draggedOver.current.has(imgId)) {
        draggedOver.current.add(imgId);
        addToSelection(imgId);
      }
    },
    [addToSelection]
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!selectMode) return;
      isDragging.current = true;
      draggedOver.current = new Set();
      containerRef.current?.setPointerCapture(e.pointerId);
      toggleImageUnderPointer(e.clientX, e.clientY);
    },
    [selectMode, toggleImageUnderPointer]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging.current) return;
      toggleImageUnderPointer(e.clientX, e.clientY);
    },
    [toggleImageUnderPointer]
  );

  const handlePointerUp = useCallback(() => {
    isDragging.current = false;
    draggedOver.current = new Set();
  }, []);

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
