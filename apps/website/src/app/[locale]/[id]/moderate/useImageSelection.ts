import { useState, useCallback } from "react";
import { useUpdateImageMutation } from "@/hooks/useImages";
import type { Image } from "@/db";

export function useImageSelection(images: Image[], eventId: string) {
  const { mutateAsync: updateImage } = useUpdateImageMutation();

  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkError, setBulkError] = useState<string | null>(null);

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

  const handleImageClick = useCallback(
    (imageId: string) => {
      if (selectMode) {
        toggleSelection(imageId);
        return;
      }
      // TODO: Open image preview when implemented.
    },
    [selectMode, toggleSelection]
  );

  const handleBulkAction = useCallback(
    async (isApproved: boolean) => {
      setBulkError(null);
      const results = await Promise.allSettled(
        Array.from(selectedIds).map(imageId =>
          updateImage({ eventId, imageId, data: { isApproved } })
        )
      );
      // Always exit select mode, partially applied changes cannot be undone by retrying the same selection.
      exitSelectMode();
      const failed = results.filter(r => r.status === "rejected").length;
      if (failed > 0) {
        setBulkError(
          `${failed} photo${failed > 1 ? "s" : ""} could not be updated.`
        );
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
    // handlers
    handleSelectToggle,
    handleSelectAll,
    handleImageClick,
    handleBulkApprove,
    handleBulkReject,
  };
}
