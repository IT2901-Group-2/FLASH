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
  const { id: eventId, locale } = useParams<{ id: string; locale: string }>();

  const [activeTab, setActiveTab] = useState<Tab>("pending");

  const { data: images = [], isLoading } = useImagesQuery(eventId, {
    approval: activeTab,
  });

  // TODO: Replace with actual moderator check when JWT auth is implemented
  // const isModerator = checkModeratorAccess(token);

  const {
    selectMode,
    selectedIds,
    allSelected,
    bulkError,
    handleSelectToggle,
    handleSelectAllToggle,
    handleImageClick,
    handleBulkApprove,
    handleBulkReject,
  } = useImageSelection(images, eventId);

  const BUTTON_COLOR = "brand-purple" as const;

  // Button matrix by tab:
  //   pending:  primary=Approve, secondary=Reject  (both actions make sense)
  //   approved: primary=Reject,  secondary=none    (already approved; only rejection is a new action)
  //   rejected: primary=Approve, secondary=none    (already rejected; only approval is a new action)
  const primaryButton = (() => {
    if (activeTab === "pending" || activeTab === "rejected") {
      return {
        text: "Approve selected photos",
        "data-color": BUTTON_COLOR,
        onClick: handleBulkApprove,
      };
    }
    return {
      text: "Reject selected photos",
      "data-color": BUTTON_COLOR,
      onClick: handleBulkReject,
    };
  })();

  const secondaryButton =
    activeTab === "pending"
      ? {
          text: "Reject selected photos",
          "data-color": BUTTON_COLOR,
          onClick: handleBulkReject,
        }
      : undefined;

  const selectionDescription = `${selectedIds.size} photo${selectedIds.size > 1 ? "s" : ""} selected`;

  return (
    <div className={styles.pageWrapper}>
      <ModerateHeader
        onBack={() => router.back()}
        selectMode={selectMode}
        onSelectToggle={handleSelectToggle}
        allSelected={allSelected}
        onSelectAll={handleSelectAllToggle}
        breadcrumbItems={[
          { label: "Event", href: `/${locale}/${eventId}` },
          { label: "Moderate" },
        ]}
      />

      <div className={styles.content}>
        <div className={styles.tabContainer}>
          <div className={selectMode ? styles.tabDisabled : undefined}>
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
          </div>
          <h2 className={styles.sectionHeading}>{TAB_HEADINGS[activeTab]}</h2>
        </div>

        {!isLoading && images.length === 0 ? (
          <div role="status" className={styles.emptyState}>
            No {activeTab} photos found
          </div>
        ) : (
          <div className={styles.grid}>
            {images.map((image, index) => (
              <ImageCard
                key={image.id}
                variant="preview2"
                src={`/api/events/${eventId}/images/${image.id}`}
                alt={`Photo ${index + 1} of ${images.length}`}
                title={`Photo ${index + 1}`}
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

      {/* Announces selection count to screen readers when it changes */}
      <div aria-live="polite" aria-atomic="true" className={styles.srOnly}>
        {selectedIds.size > 0 ? selectionDescription : ""}
      </div>

      {selectedIds.size > 0 && (
        <div className={styles.actionCardContainer}>
          <ActionCard
            data-color="background-secondary"
            description={selectionDescription}
            primaryButton={primaryButton}
            secondaryButton={secondaryButton}
          />
        </div>
      )}
    </div>
  );
}
