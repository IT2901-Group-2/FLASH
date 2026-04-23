"use client";
import { useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  ImageMinus,
  QrCode,
  Upload,
  X,
} from "lucide-react";
import styles from "./UploadImage.module.css";
import {
  ActionCard,
  Button,
  Dialog,
  QRDisplay,
  SegmentedControl,
  Title,
} from "@flash/ui";
import { ImageCard } from "@/components/ImageCard/ImageCard";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { useEventCodeQuery, useEventsQuery } from "@/hooks/useEvents";
import { useEventAuth } from "@/providers/EventAuthContext";
import { PhoneHeader } from "@/components/PhoneHeader/PhoneHeader";
import {
  useDownloadImagesMutation,
  useImagesQuery,
  useMyImagesQuery,
  useUploadedImageCountQuery,
  useUploadImageMutation,
} from "@/hooks/useImages";
import Image from "next/image";
import { getImageSrc } from "@/lib/utils/images";

const EVENT_REFETCH_INTERVAL = 120_000; // 2 minutes

const PHOTOS_REFETCH_INTERVAL = 12_000; // 12 sec

export default function Page() {
  const router = useRouter();
  const tCommon = useTranslations("common");
  const tUpload = useTranslations("guest.event.upload");
  const eventAuth = useEventAuth();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { mutate: downloadImages } = useDownloadImagesMutation();

  // Event Data
  const { id: eventId } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useEventsQuery(
    eventId ? { id: [eventId] } : undefined,
    undefined,
    EVENT_REFETCH_INTERVAL
  );
  const eventData = data?.[0];
  const uploadsArePrivate = eventData?.uploadsArePrivate ?? false;

  const [activeTab, setActiveTab] = useState<"all" | "user">("all");
  const showTabs = uploadsArePrivate || !!eventAuth.isModerator;
  const isShowingUserTab = !showTabs || activeTab === "user";

  // Image Data
  const { data: imagesData } = useImagesQuery(
    eventId,
    { approval: "approved" },
    !isShowingUserTab,
    PHOTOS_REFETCH_INTERVAL
  );
  const { data: myImagesData } = useMyImagesQuery(
    eventId,
    isShowingUserTab,
    PHOTOS_REFETCH_INTERVAL
  );
  const { data: uploadedCountData } = useUploadedImageCountQuery(eventId);

  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const displayedImages = (isShowingUserTab ? myImagesData : imagesData) ?? [];

  const handleTabChange = (val: string) => {
    if (val === "all" || val === "user") setActiveTab(val);
    setPreviewIndex(null);
  };
  const touchStartX = useRef<number | null>(null);
  const { mutateAsync: uploadImage } = useUploadImageMutation();

  // Join Code
  const { data: joinCode } = useEventCodeQuery(eventId, "guest");
  const [joinLink, setJoinLink] = useState<string | null>(null);
  useEffect(() => {
    (async () =>
      setJoinLink(new URL(`/join/${joinCode}`, window.location.origin).href))();
  }, [setJoinLink, joinCode]);

  //Event date data
  const isEnded = eventData ? new Date() > eventData.endDate : false;

  // Translation strings
  const eventName =
    eventData?.name ??
    (isLoading ? tUpload("loadingEvent") : tUpload("eventFallbackName"));

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

  const { openFilePicker, FileInput } = useFileUpload({
    multiple: false,
    onFilesSelected: async files => {
      if (!eventId) {
        setUploadError(tUpload("errors.uploadUnavailable"));
        return;
      }

      setUploadError(null);
      setIsUploading(true);

      try {
        const [results] = await Promise.all([
          Promise.allSettled(
            Array.from(files).map(file => uploadImage({ eventId, file }))
          ),
          new Promise(resolve => setTimeout(resolve, 650)),
        ]);
        const successfulUploads = results.filter(r => r.status === "fulfilled").length;
        const failureCount = results.length - successfulUploads;

        const hasUploadLimitError = results.some(
          (result): result is PromiseRejectedResult =>
            result.status === "rejected" &&
            result.reason instanceof Error &&
            /upload\s+limit\s+reached/i.test(result.reason.message)
        );

        if (failureCount > 0) {
          setUploadError(
            hasUploadLimitError
              ? tUpload("errors.uploadLimitReached")
              : tUpload("errors.uploadFailed", { count: failureCount })
          );
        }
      } finally {
        setIsUploading(false);
      }
    },
  });

  useEffect(() => {
    if (eventAuth !== undefined && !eventAuth.isAuthenticated) {
      router.push("/");
    }
  }, [eventAuth, router]);

  useEffect(() => {
    if (previewIndex === null) return;

    const previousOverflow = document.body.style.overflow;
    const previousOverscrollBehavior = document.body.style.overscrollBehavior;

    document.body.style.overflow = "hidden";
    document.body.style.overscrollBehavior = "none";

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.overscrollBehavior = previousOverscrollBehavior;
    };
  }, [previewIndex]);

  useEffect(() => {
    if (previewIndex === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setPreviewIndex(null);
        return;
      }

      if (displayedImages.length <= 1) return;

      if (event.key === "ArrowRight") {
        event.preventDefault();
        setPreviewIndex(currentIndex =>
          currentIndex === null ? null : (currentIndex + 1) % displayedImages.length
        );
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setPreviewIndex(currentIndex =>
          currentIndex === null
            ? null
            : (currentIndex - 1 + displayedImages.length) % displayedImages.length
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [displayedImages.length, previewIndex]);

  useEffect(() => {
    if (previewIndex === null) return;
    if (displayedImages.length === 0) {
      setPreviewIndex(null);
      return;
    }

    if (previewIndex > displayedImages.length - 1) {
      setPreviewIndex(displayedImages.length - 1);
    }
  }, [displayedImages.length, previewIndex]);

  const handleImagePreview = (index: number) => setPreviewIndex(index);

  const closePreview = () => setPreviewIndex(null);

  const nextPreviewImage = () => {
    if (previewIndex === null || displayedImages.length === 0) return;
    setPreviewIndex((previewIndex + 1) % displayedImages.length);
  };

  const prevPreviewImage = () => {
    if (previewIndex === null || displayedImages.length === 0) return;
    setPreviewIndex((previewIndex - 1 + displayedImages.length) % displayedImages.length);
  };

  const handlePreviewTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const handlePreviewTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) return;
    const endX = event.changedTouches[0]?.clientX;
    if (typeof endX !== "number") return;

    const deltaX = endX - touchStartX.current;
    touchStartX.current = null;

    if (Math.abs(deltaX) < 40) return;

    if (deltaX > 0) {
      prevPreviewImage();
    } else {
      nextPreviewImage();
    }
  };

  const previewImage =
    previewIndex !== null && displayedImages[previewIndex]
      ? {
          src: getImageSrc(eventId, displayedImages[previewIndex].id),
          alt: tUpload("imageAlt", {
            index: previewIndex + 1,
            total: displayedImages.length,
          }),
        }
      : null;

  return (
    <>
      <FileInput />
      <Dialog ref={dialogRef} closedby="any" className={styles.qrCodeContainer}>
        <div className={styles.qrCodeContainer}>
          {joinLink !== null && (
            <QRDisplay
              value={joinLink}
              size="large"
              helperText={tCommon("messages.scanToUploadPhotos")}
              code={joinCode}
            />
          )}
          <Button
            variant="secondary"
            data-color="neutral"
            onClick={() => dialogRef.current?.close()}
            fill
          >
            {tCommon("actions.close")}
          </Button>
        </div>
      </Dialog>

      {previewImage && (
        <div
          className={styles.previewPage}
          role="dialog"
          aria-modal="true"
          onTouchStart={handlePreviewTouchStart}
          onTouchEnd={handlePreviewTouchEnd}
        >
          <Image
            fill
            src={previewImage.src}
            alt={previewImage.alt}
            className={styles.previewFullscreenImage}
            sizes="100vw"
          />
          <Button
            className={styles.previewClose}
            onClick={closePreview}
            variant="icon"
            icon={<X />}
          />
          {displayedImages.length > 1 && (
            <>
              <Button
                className={styles.previewNavButtonLeft}
                onClick={prevPreviewImage}
                variant="icon"
                icon={<ChevronLeft />}
              />
              <Button
                className={styles.previewNavButtonRight}
                onClick={nextPreviewImage}
                variant="icon"
                icon={<ChevronRight />}
              />
            </>
          )}
        </div>
      )}

      <div className={styles.pageWrapper}>
        <PhoneHeader
          title={eventName}
          username={eventAuth?.nickname ?? ""}
          description={uploadDescription}
        >
          <Button
            icon={<QrCode />}
            iconPosition="right"
            data-color="brand-purple"
            variant="secondary"
            onClick={() => dialogRef.current?.showModal()}
          />
          {eventAuth.isModerator && (
            <Button
              icon={<ImageMinus />}
              iconPosition="right"
              data-color="brand-purple"
              variant="primary"
              onClick={() => router.push(`./${eventId}/moderate`)}
              className={styles.desktopOnly}
            >
              {tCommon("actions.moderate")}
            </Button>
          )}
          <Button
            icon={isEnded ? <Download /> : <Upload />}
            iconPosition="right"
            data-color="brand-purple"
            variant="primary"
            onClick={isEnded ? () => downloadImages({ eventId }) : openFilePicker}
            loading={isUploading}
            className={styles.desktopOnly}
          >
            {isEnded ? tCommon("actions.downloadImages") : tCommon("actions.uploadImage")}
          </Button>
        </PhoneHeader>
        {!isLoading && (isError || !eventData) ? (
          <p className={styles.errorText}>{tUpload("eventLoadFailed")}</p>
        ) : null}
        {uploadError && (
          <p role="alert" className={`${styles.errorText} ${styles.desktopOnly}`}>
            {uploadError}
          </p>
        )}
        <div className={styles.mobileOnly}>
          <ActionCard
            data-testid="action-card"
            description={uploadError ?? uploadDescription}
            descriptionColor={uploadError ? "danger" : undefined}
            primaryButton={{
              "data-color": "brand-purple",
              icon: isEnded ? <Download size={18} /> : <Upload size={18} />,
              iconPosition: "right",
              text: isEnded
                ? tCommon("actions.downloadImages")
                : tCommon("actions.uploadImage"),
              onClick: isEnded ? () => downloadImages({ eventId }) : openFilePicker,
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

      {!isLoading && displayedImages.length === 0 ? (
        <div role="status" className={styles.emptyState}>
          {isShowingUserTab ? tUpload("userPhotosEmptyState") : tUpload("emptyState")}
        </div>
      ) : (
        <div className={styles.grid}>
          {displayedImages.map((image, index) => (
            <ImageCard
              key={image.id}
              src={getImageSrc(eventId, image.id, { width: 200, height: 200 })}
              alt={tUpload("imageAlt", {
                index: index + 1,
                total: displayedImages.length,
              })}
              title={tUpload("imageTitle", { index: index + 1 })}
              data-image-id={image.id}
              placeholder={image.previewImage}
              state={
                image.isApproved === null
                  ? "pending"
                  : image.isApproved === false
                    ? "rejected"
                    : undefined
              }
              onClick={() => handleImagePreview(index)}
            />
          ))}
        </div>
      )}
    </>
  );
}
