"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ActionCard, ImageCard, SegmentedControl } from "@flash/ui";
import { ModerateHeader } from "@/components/ModerateHeader";
import { useImagesQuery } from "@/hooks/useImages";
import { useImageSelection } from "./useImageSelection";
import { useTranslations } from "next-intl";
import styles from "./Moderate.module.css";

type Tab = "pending" | "approved" | "rejected";

export default function ModeratePage() {
  const router = useRouter();
  const { id: eventId, locale } = useParams<{ id: string; locale: string }>();
  const t = useTranslations("guest.event.moderate");

  const [activeTab, setActiveTab] = useState<Tab>("pending");

  const { data: imagesPages, isLoading } = useImagesQuery(eventId, {
    approval: activeTab,
  });
  const images = imagesPages?.pages.flatMap(page => page.items) ?? [];

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
        text: t("actions.approveSelected"),
        "data-color": BUTTON_COLOR,
        onClick: handleBulkApprove,
      };
    }
    return {
      text: t("actions.rejectSelected"),
      "data-color": BUTTON_COLOR,
      onClick: handleBulkReject,
    };
  })();

  const secondaryButton =
    activeTab === "pending"
      ? {
          text: t("actions.rejectSelected"),
          "data-color": BUTTON_COLOR,
          onClick: handleBulkReject,
        }
      : undefined;

  return (
    <div className={styles.pageWrapper}>
      <ModerateHeader
        onBack={() => router.back()}
        selectMode={selectMode}
        onSelectToggle={handleSelectToggle}
        allSelected={allSelected}
        onSelectAll={handleSelectAllToggle}
        breadcrumbItems={[
          { label: t("breadcrumb.event"), href: `/${locale}/${eventId}` },
          { label: t("breadcrumb.moderate") },
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
              data-testid="segmented-control"
            >
              <SegmentedControl.Item
                value="pending"
                label={t("tabs.pending")}
                disabled={selectMode}
              />
              <SegmentedControl.Item
                value="approved"
                label={t("tabs.approved")}
                disabled={selectMode}
              />
              <SegmentedControl.Item
                value="rejected"
                label={t("tabs.rejected")}
                disabled={selectMode}
              />
            </SegmentedControl>
          </div>
          <h2 className={styles.sectionHeading}>{t(`headings.${activeTab}`)}</h2>
        </div>

        {!isLoading && images.length === 0 ? (
          <div role="status" className={styles.emptyState}>
            {t(`emptyState.${activeTab}`)}
          </div>
        ) : (
          <div className={styles.grid}>
            {images.map((image, index) => (
              <ImageCard
                key={image.id}
                variant="preview2"
                src={`/api/events/${eventId}/images/${image.id}`}
                alt={t("imageAlt", { index: index + 1, total: images.length })}
                title={t("imageTitle", { index: index + 1 })}
                state={selectMode && selectedIds.has(image.id) ? "selected" : "default"}
                onClick={() => handleImageClick(image.id)}
                data-testid={image.id}
                placeholder={image.previewImage}
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
            data-testid="action-card"
            description={t("selectionDescription", { count: selectedIds.size })}
            primaryButton={primaryButton}
            secondaryButton={secondaryButton}
          />
        </div>
      )}
    </div>
  );
}
