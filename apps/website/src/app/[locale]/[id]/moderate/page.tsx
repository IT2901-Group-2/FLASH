"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ActionCard, ImageCard, SegmentedControl } from "ui";
import { ModerateHeader } from "@/components/ModerateHeader";
import { useImagesQuery } from "@/hooks/useImages";
import { useImageSelection } from "./useImageSelection";
import styles from "./Moderate.module.css";

type Tab = "pending" | "approved" | "rejected";

const TAB_HEADINGS: Record<Tab, string> = {
  pending: "Photos to approve",
  approved: "Approved photos",
  rejected: "Rejected photos",
};

export default function ModeratePage() {
  const router = useRouter();
  const { id: eventId } = useParams<{ id: string }>();

  const [activeTab, setActiveTab] = useState<Tab>("pending");

  const { data: images = [], isLoading } = useImagesQuery(eventId, {
    approval: activeTab,
  });

  // TODO: Replace with actual moderator check when JWT auth is implemented
  // const isModerator = checkModeratorAccess(token);

  const {
    selectMode,
    selectedIds,
    bulkError,
    containerRef,
    handleSelectToggle,
    handleSelectAll,
    handleImageClick,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleBulkApprove,
    handleBulkReject,
  } = useImageSelection(images, eventId);

  const primaryButton = (() => {
    if (activeTab === "pending" || activeTab === "rejected") {
      return {
        text: "Approve selected photos",
        "data-color": "brand-purple" as const,
        onClick: handleBulkApprove,
      };
    }
    return {
      text: "Reject selected photos",
      "data-color": "brand-purple" as const,
      onClick: handleBulkReject,
    };
  })();

  const secondaryButton =
    activeTab === "pending"
      ? {
          text: "Reject selected photos",
          "data-color": "brand-purple" as const,
          onClick: handleBulkReject,
        }
      : undefined;

  return (
    <div className={styles.pageWrapper}>
      {/* Screen-reader live region: announces selection count changes */}
      <div aria-live="polite" aria-atomic="true" className={styles.srOnly}>
        {selectedIds.size > 0
          ? `${selectedIds.size} photo${selectedIds.size > 1 ? "s" : ""} selected`
          : ""}
      </div>

      <ModerateHeader
        onBack={() => router.back()}
        selectMode={selectMode}
        onSelectToggle={handleSelectToggle}
        onSelectAll={handleSelectAll}
      />

      <div className={styles.content}>
        <div className={styles.tabContainer}>
          <SegmentedControl
            fill
            data-color="accent"
            value={activeTab}
            onChange={val => setActiveTab(val as Tab)}
          >
            <SegmentedControl.Item
              value="pending"
              label="Pending"
              disabled={selectMode}
            />
            <SegmentedControl.Item
              value="approved"
              label="Approved"
              disabled={selectMode}
            />
            <SegmentedControl.Item
              value="rejected"
              label="Rejected"
              disabled={selectMode}
            />
          </SegmentedControl>
          <h2 className={styles.sectionHeading}>{TAB_HEADINGS[activeTab]}</h2>
        </div>

        {!isLoading && images.length === 0 ? (
          <div role="status" className={styles.emptyState}>
            No {activeTab} photos found
          </div>
        ) : (
          <div
            ref={containerRef}
            className={styles.grid}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
          >
            {images.map(image => (
              <ImageCard
                key={image.id}
                variant="preview2"
                src={`/api/events/${eventId}/images/${image.id}`}
                alt={image.id}
                title={image.id}
                state={selectMode && selectedIds.has(image.id) ? "selected" : "default"}
                onClick={() => handleImageClick(image.id)}
                data-image-id={image.id}
              />
            ))}
          </div>
        )}
      </div>
      {/* The error banner/sonnar/toast is just a placeholder for now,
      and is to be implemented as a component later */}
      {bulkError && (
        <div role="alert" className={styles.errorBanner}>
          {bulkError}
        </div>
      )}

      {selectedIds.size > 0 && (
        <div className={styles.actionCardContainer}>
          <ActionCard
            data-color="background-secondary"
            description={`${selectedIds.size} photo${selectedIds.size > 1 ? "s" : ""} selected`}
            primaryButton={primaryButton}
            secondaryButton={secondaryButton}
          />
        </div>
      )}
    </div>
  );
}
