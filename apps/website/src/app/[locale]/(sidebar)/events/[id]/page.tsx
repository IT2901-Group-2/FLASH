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
  useDownloadImagesMutation,
  useImagesQuery,
  useMyImagesQuery,
  useUploadedImageCountQuery,
} from "@/hooks/useImages";
import { useEventAuth } from "@/providers/EventAuthContext";
import { Button, Card, SegmentedControl, Title, useToast } from "@flash/ui";
import { ChevronRight, Download, ImageMinus, OctagonAlert, Upload } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./UploadImage.module.css";
import { useFileUpload } from "@/hooks/useFileUpload";
import { getUploadsRemaining, hasEnded } from "@/utils/event-utils";
import useIsMobile from "@/hooks/useIsMobile";
import { MULTI_FILE_UPLOAD, TOAST_DISPLAY_TIME } from "@/config/event";

const IMAGE_PAGE_SIZE = 12;

export default function Page() {
  const router = useRouter();
  const tCommon = useTranslations("common");
  const tUpload = useTranslations("guest.event.upload");
  const eventAuth = useEventAuth();
  const imagePreviewRef = useRef<ImagePreviewHandle>(null);
  const { createToast } = useToast();
  const { mutateAsync: download } = useDownloadImagesMutation();
  const isMobile = useIsMobile();

  const [activeTab, setActiveTab] = useState<"all" | "user">("all");

  // Event Data
  const { id: eventId } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useEventsQuery(
    eventId ? { id: [eventId] } : undefined,
    undefined,
    EVENT_REFETCH_INTERVAL
  );
  const eventData = data?.pages[0]?.items[0];
  const uploadsArePrivate = eventData?.uploadsArePrivate ?? false;
  const showTabs = uploadsArePrivate || !!eventAuth.isModerator;
  const isShowingUserTab = !showTabs || activeTab === "user";

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

  useEffect(() => {
    if (eventAuth !== undefined && !eventAuth.isAuthenticated) {
      router.push("/");
    }
  }, [eventAuth, router, eventData]);

  const errorToast = useCallback(
    (message: string) =>
      createToast({
        title: tUpload("errors.uploadFailedTitle"),
        description: message,
        icon: <OctagonAlert />,
        "data-color": "danger",
        duration: TOAST_DISPLAY_TIME,
      }),
    [createToast, tUpload]
  );

  const getUploadDescription = useCallback(
    (remaining: number | undefined, ended: boolean) => {
      if (ended) return tCommon("uploads.eventEnded");
      if (remaining === undefined) return tCommon("uploads.unlimited.long");
      if (remaining === 0) return tCommon("uploads.none.long");
      return tCommon("uploads.remaining.long", { count: remaining });
    },
    [tCommon]
  );

  const { openFilePicker, FileInput, isUploading } = useFileUpload({
    multiple: MULTI_FILE_UPLOAD,
    eventId,
    onError: e => errorToast(e.message),
    maxSizeBytes: MAX_IMAGE_SIZE,
  });

  const isEnded = hasEnded(eventData);
  const uploadsRemaining = getUploadsRemaining(eventData, uploadedCountData?.count ?? 0);

  return (
    <>
      <ImagePreview ref={imagePreviewRef} images={displayedImages} />
      <FileInput />
      <PhoneHeader />

      <div className={styles.pageWrapper}>
        {!isLoading && (isError || !eventData) ? (
          <p className={styles.errorText}>{tUpload("eventLoadFailed")}</p>
        ) : null}

        {showTabs && (
          <SegmentedControl
            fill
            value={activeTab}
            onChange={t => setActiveTab(t as "all" | "user")}
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
              size={isMobile ? "small" : "medium"}
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
            isApproved === null
              ? "pending"
              : isApproved === false
                ? "rejected"
                : undefined
          }
        />
      </div>

      <div className={styles.actionCardContainer}>
        <Card data-testid="action-card" className={styles.actionCard}>
          {getUploadDescription(uploadsRemaining, isEnded)}
          {eventAuth.isModerator && (
            <Button
              data-color="brand-purple"
              icon={<ImageMinus />}
              iconPosition="right"
              variant="secondary"
              onClick={() => router.push(`./${eventId}/moderate`)}
              fill
            >
              Moderate
            </Button>
          )}
          <Button
            data-color="brand-purple"
            icon={isEnded ? <Download /> : <Upload />}
            iconPosition="right"
            loading={isUploading}
            onClick={isEnded ? () => download({ eventId }) : openFilePicker}
            fill
          >
            {isEnded ? tCommon("actions.downloadImages") : tCommon("actions.uploadImage")}
          </Button>
        </Card>
      </div>
    </>
  );
}
