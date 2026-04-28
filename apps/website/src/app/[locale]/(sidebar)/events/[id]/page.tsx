"use client";

import { ImagePreview, ImagePreviewHandle } from "@/components/ImagePreview/ImagePreview";
import { PhoneHeader } from "@/components/Headers";
import { PhotoList } from "@/components/PhotoList/PhotoList";
import {
  EVENT_REFETCH_INTERVAL,
  MAX_IMAGE_SIZE,
  PHOTOS_REFETCH_INTERVAL,
} from "@/config";
import { useEventsQuery } from "@/hooks/useEvents";
import {
  useImagesQuery,
  useMyImagesQuery,
  useUploadedImageCountQuery,
} from "@/hooks/useImages";
import { useEventAuth } from "@/providers/EventAuthContext";
import { ActionCard, Button, SegmentedControl, Title } from "@flash/ui";
import { ChevronRight, Download, ImageMinus, Upload } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import styles from "./UploadImage.module.css";

const IMAGE_PAGE_SIZE = 12;

export default function Page() {
  const router = useRouter();
  const tCommon = useTranslations("common");
  const tUpload = useTranslations("guest.event.upload");
  const eventAuth = useEventAuth();
  const imagePreviewRef = useRef<ImagePreviewHandle>(null);

  // Event Data
  const { id: eventId } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useEventsQuery(
    eventId ? { id: [eventId] } : undefined,
    undefined,
    EVENT_REFETCH_INTERVAL
  );
  const eventData = data?.pages[0]?.items[0];
  const uploadsArePrivate = eventData?.uploadsArePrivate ?? false;
  const [activeTab, setActiveTab] = useState<"all" | "user">("all");
  const showTabs = uploadsArePrivate || !!eventAuth.isModerator;
  const isShowingUserTab = !showTabs || activeTab === "user";

  const handleTabChange = (val: string) => {
    if (val === "all" || val === "user") setActiveTab(val);
  };

  const myImagesQuery = useMyImagesQuery(
    eventId,
    { pageSize: IMAGE_PAGE_SIZE },
    isShowingUserTab,
    PHOTOS_REFETCH_INTERVAL
  );

  const imagesQuery = useImagesQuery(
    eventId,
    { approval: "approved", pageSize: IMAGE_PAGE_SIZE },
    !isShowingUserTab,
    PHOTOS_REFETCH_INTERVAL
  );

  const activeQuery = isShowingUserTab ? myImagesQuery : imagesQuery;
  const displayedImages = activeQuery.data?.pages.flatMap(page => page.items) ?? [];

  const { data: uploadedCountData } = useUploadedImageCountQuery(eventId);

  const [isUploading, setIsUploading] = useState(false);

  //Event date data
  const isEnded = eventData ? new Date() > eventData.endDate : false;

  const userImageCount = uploadedCountData?.count ?? 0;

  const uploadsRemaining =
    typeof eventData?.uploadLimit === "number"
      ? Math.max(0, eventData.uploadLimit - userImageCount)
      : undefined;

  const uploadDescription = isEnded
    ? tCommon("uploads.eventEnded")
    : typeof uploadsRemaining !== "number"
      ? tCommon("uploads.unlimited.long")
      : uploadsRemaining === 0
        ? tCommon("uploads.none.long")
        : tCommon("uploads.remaining.long", { count: uploadsRemaining });

  useEffect(() => {
    if (eventAuth !== undefined && !eventAuth.isAuthenticated) {
      router.push("/");
    }
  }, [eventAuth, router, eventData]);

  return (
    <>
      <ImagePreview ref={imagePreviewRef} images={displayedImages} />

      <div className={styles.pageWrapper}>
        <PhoneHeader />

        {!isLoading && (isError || !eventData) ? (
          <p className={styles.errorText}>{tUpload("eventLoadFailed")}</p>
        ) : null}

        <div className={styles.mobileOnly}>
          <ActionCard
            data-testid="action-card"
            description={uploadDescription}
            primaryButton={{
              "data-color": "brand-purple",
              icon: isEnded ? <Download size={18} /> : <Upload size={18} />,
              iconPosition: "right",
              text: isEnded
                ? tCommon("actions.downloadImages")
                : tCommon("actions.uploadImage"),
              // onClick: isEnded ? () => downloadImages({ eventId }) : openFilePicker,
              loading: isUploading,
            }}
            secondaryButton={
              eventAuth.isModerator
                ? {
                    icon: <ImageMinus />,
                    iconPosition: "right",
                    "data-color": "brand-purple",
                    variant: "secondary",
                    text: "Moderate",
                    onClick: () => router.push(`./${eventId}/moderate`),
                  }
                : undefined
            }
          />
        </div>
      </div>

      {showTabs && (
        <SegmentedControl
          fill
          className={styles.tabContainer}
          value={activeTab}
          onChange={handleTabChange}
        >
          <SegmentedControl.Item value="all" label={tUpload("tabs.allPhotos")} />
          <SegmentedControl.Item value="user" label={tUpload("tabs.userPhotos")} />
        </SegmentedControl>
      )}

      <div className={styles.sectionTitleRow}>
        <Title as="h2" className={styles.sectionTitle}>
          {isShowingUserTab ? tUpload("tabs.userPhotos") : tUpload("tabs.allPhotos")}
        </Title>
        {!isShowingUserTab && (
          <Button
            variant="secondary"
            icon={<ChevronRight />}
            iconPosition="right"
            className={styles.slideshowButton}
            onClick={() => router.push(`./${eventId}/slideshow`)}
          >
            {tCommon("actions.slideshow")}
          </Button>
        )}
      </div>
      <PhotoList
        eventId={eventId}
        query={isShowingUserTab ? myImagesQuery : imagesQuery}
        loadingText={
          isShowingUserTab ? tUpload("userPhotosEmptyState") : tUpload("emptyState")
        }
        onClick={({ index }) => imagePreviewRef.current?.open(index)}
        setState={({ isApproved }) =>
          isApproved === null ? "pending" : isApproved === false ? "rejected" : undefined
        }
      />
    </>
  );
}
