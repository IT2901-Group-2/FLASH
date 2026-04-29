import { useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useBatchUpdateImageMutation, imagesKeys } from "@/hooks/useImages";
import { BATCH_IMAGE_LIMIT } from "@/config/images";
import type { Image } from "@/db";

export function useImageSelection(
  images: Image[],
  eventId: string,
  { onError }: { onError?: (count: number) => void } = {}
) {
  const queryClient = useQueryClient();
  const { mutateAsync: batchUpdateImage } = useBatchUpdateImageMutation();

  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const exitSelectMode = useCallback(() => {
    setSelectMode(false);
    setSelectedIds(new Set());
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

      // Invalidate once after all chunks so the UI updates in one batch.
      // Fire-and-forget: don't block exitSelectMode on the refetch.
      if (failed < allIds.length) {
        queryClient.invalidateQueries({ queryKey: imagesKeys.event(eventId) });
      }

      // Always exit select mode, partially applied changes cannot be undone by retrying the same selection.
      exitSelectMode();
      if (failed > 0) {
        onError?.(failed);
      }
    },
    [selectedIds, batchUpdateImage, eventId, exitSelectMode, queryClient, onError]
  );

  const handleBulkApprove = useCallback(() => handleBulkAction(true), [handleBulkAction]);
  const handleBulkReject = useCallback(() => handleBulkAction(false), [handleBulkAction]);

  return {
    // state
    selectMode,
    selectedIds,
    allSelected,
    // handlers
    handleSelectToggle,
    handleSelectAllToggle,
    handleImageClick,
    handleBulkApprove,
    handleBulkReject,
  };
}
