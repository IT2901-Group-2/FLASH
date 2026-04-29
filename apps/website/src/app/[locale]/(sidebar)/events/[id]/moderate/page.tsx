"use client";

import { ImagePreview, ImagePreviewHandle } from "@/components/ImagePreview/ImagePreview";
import { ModerateHeader } from "@/components/Headers";
import { PHOTOS_REFETCH_INTERVAL } from "@/config/images";
import { useImagesQuery } from "@/hooks/useImages";
import { Button, Card, SegmentedControl, Title, useToast } from "@flash/ui";
import { CircleAlert } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import styles from "./Moderate.module.css";
import { useImageSelection } from "./useImageSelection";
import { PhotoList } from "@/components/PhotoList/PhotoList";
import { TOAST_DISPLAY_TIME } from "@/config/event";
import { cl } from "@/utils/className";

type Tab = "pending" | "approved" | "rejected";

export default function ModeratePage() {
  const router = useRouter();
  const { createToast } = useToast();
  const { id: eventId } = useParams<{ id: string }>();
  const imagePreviewRef = useRef<ImagePreviewHandle>(null);
  const [activeTab, setActiveTab] = useState<Tab>("pending");
  const t = useTranslations("guest.event.moderate");

  const handleError = useCallback(
    (count: number) =>
      createToast({
        title: t("bulkUpdateFailed", { count }),
        "data-color": "primary",
        icon: <CircleAlert style={{ color: "var(--color-danger-base)" }} />,
        position: "top-center",
        duration: TOAST_DISPLAY_TIME,
      }),
    [createToast, t]
  );

  const imagesQuery = useImagesQuery(
    eventId,
    { approval: activeTab },
    true,
    PHOTOS_REFETCH_INTERVAL
  );
  const images = imagesQuery.data?.pages.flatMap(page => page.items) ?? [];

  const {
    selectMode,
    selectedIds,
    allSelected,
    handleSelectToggle,
    handleSelectAllToggle,
    handleImageClick,
    handleBulkApprove,
    handleBulkReject,
  } = useImageSelection(images, eventId, { onError: handleError });

  return (
    <>
      <ModerateHeader
        onBack={() => router.back()}
        selectMode={selectMode}
        onSelectToggle={handleSelectToggle}
        allSelected={allSelected}
        onSelectAll={handleSelectAllToggle}
      />

      <section className={styles.content}>
        <div className={cl(selectMode && styles.tabDisabled)}>
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
        <Title as="h2" size="medium" weight="bold" className={styles.sectionHeading}>
          {t(`headings.${activeTab}`)}
        </Title>

        <PhotoList
          eventId={eventId}
          query={imagesQuery}
          loadingText={t(`emptyState.${activeTab}`)}
          onClick={({ id, index }) =>
            selectMode ? handleImageClick(id) : imagePreviewRef.current?.open(index)
          }
          setState={({ id }) =>
            selectMode && selectedIds.has(id) ? "selected" : "default"
          }
        />
      </section>

      <ImagePreview ref={imagePreviewRef} images={images} />

      {selectedIds.size > 0 && (
        <div className={styles.actionCardContainer}>
          <Card data-testid="action-card" className={styles.card}>
            {t("selectionDescription", { count: selectedIds.size })}
            {activeTab === "pending" && (
              <Button
                data-color="brand-purple"
                onClick={handleBulkReject}
                variant="secondary"
                fill
              >
                {t("actions.rejectSelected")}
              </Button>
            )}
            {activeTab === "approved" ? (
              <Button data-color="brand-purple" onClick={handleBulkReject} fill>
                {t("actions.rejectSelected")}
              </Button>
            ) : (
              <Button data-color="brand-purple" onClick={handleBulkApprove} fill>
                {t("actions.approveSelected")}
              </Button>
            )}
          </Card>
        </div>
      )}
    </>
  );
}
