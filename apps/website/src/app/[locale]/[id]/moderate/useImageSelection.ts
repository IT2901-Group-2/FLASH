import { useState, useCallback } from "react";
import { useBatchUpdateImageMutation } from "@/hooks/useImages";
import { BATCH_IMAGE_LIMIT } from "@/config";
import type { Image } from "@/db";

export function useImageSelection(images: Image[], eventId: string) {
  const { mutateAsync: batchUpdateImage } = useBatchUpdateImageMutation();

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

  const allSelected = images.length > 0 && selectedIds.size === images.length;

  const handleSelectAllToggle = useCallback(() => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(images.map(img => img.id)));
    }
  }, [allSelected, images]);

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
      const allIds = Array.from(selectedIds);
      let failed = 0;

      for (let i = 0; i < allIds.length; i += BATCH_IMAGE_LIMIT) {
        const chunk = allIds.slice(i, i + BATCH_IMAGE_LIMIT);
        try {
          await batchUpdateImage({ eventId, ids: chunk, isApproved });
        } catch {
          failed += chunk.length;
        }
      }

      // Always exit select mode, partially applied changes cannot be undone by retrying the same selection.
      exitSelectMode();
      if (failed > 0) {
        setBulkError(`${failed} photo${failed > 1 ? "s" : ""} could not be updated.`);
      }
    },
    [selectedIds, batchUpdateImage, eventId, exitSelectMode]
  );

  const handleBulkApprove = useCallback(() => handleBulkAction(true), [handleBulkAction]);
  const handleBulkReject = useCallback(() => handleBulkAction(false), [handleBulkAction]);

  return {
    // state
    selectMode,
    selectedIds,
    allSelected,
    bulkError,
    // handlers
    handleSelectToggle,
    handleSelectAllToggle,
    handleImageClick,
    handleBulkApprove,
    handleBulkReject,
  };
}
