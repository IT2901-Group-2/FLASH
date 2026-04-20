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
import { ActionCard, Button, Dialog, ImageCard, QRDisplay } from "@flash/ui";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { useEventCodeQuery, useEventsQuery } from "@/hooks/useEvents";
import { useEventAuth } from "@/providers/EventAuthContext";
import { PhoneHeader } from "@/components/PhoneHeader/PhoneHeader";
import {
  useDownloadImagesMutation,
  useImagesQuery,
  useUploadedImageCountQuery,
  useUploadImageMutation,
} from "@/hooks/useImages";
import Image from "next/image";

const IMAGE_PAGE_SIZE = 12;

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
    eventId ? { id: [eventId] } : undefined
  );
  const eventData = data?.pages[0]?.items[0];

  // Image Data
  const {
    data: imagesPages,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    isLoading: isImagesLoading,
  } = useImagesQuery(eventId, { approval: "approved", pageSize: IMAGE_PAGE_SIZE });
  const images = imagesPages?.pages.flatMap(page => page.items) ?? [];
  const { data: uploadedCountData } = useUploadedImageCountQuery(eventId);

  const loadMoreRef = useRef<HTMLDivElement>(null);
  const hasUserScrolledRef = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 0) {
        hasUserScrolledRef.current = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Auto-fetch the next page when the user scrolls near the end of the current list.
  useEffect(() => {
    if (hasNextPage !== true) return;

    const target = loadMoreRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      entries => {
        const entry = entries[0];
        if (!entry?.isIntersecting || isFetchingNextPage) return;
        if (!hasUserScrolledRef.current) return;
        void fetchNextPage();
      },
      {
        root: null,
        rootMargin: "200px 0px",
        threshold: 0,
      }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  // If the first page doesn't fill the viewport, keep fetching until it does or no pages remain.
  useEffect(() => {
    if (hasNextPage !== true || isFetchingNextPage) return;

    const viewportNotFilled = document.documentElement.scrollHeight <= window.innerHeight;
    if (!viewportNotFilled) return;

    void fetchNextPage();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, images.length]);

  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
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
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [previewIndex]);

  useEffect(() => {
    if (previewIndex === null) return;
    if (images.length === 0) {
      setPreviewIndex(null);
      return;
    }

    if (previewIndex > images.length - 1) {
      setPreviewIndex(images.length - 1);
    }
  }, [images.length, previewIndex]);

  const handleImagePreview = (index: number) => setPreviewIndex(index);

  const closePreview = () => setPreviewIndex(null);

  const nextPreviewImage = () => {
    if (previewIndex === null || images.length === 0) return;
    setPreviewIndex((previewIndex + 1) % images.length);
  };

  const prevPreviewImage = () => {
    if (previewIndex === null || images.length === 0) return;
    setPreviewIndex((previewIndex - 1 + images.length) % images.length);
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
    previewIndex !== null && images[previewIndex]
      ? {
          src: `/api/events/${eventId}/images/${images[previewIndex].id}`,
          alt: tUpload("imageAlt", { index: previewIndex + 1, total: images.length }),
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
          {images.length > 1 && (
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
            className={eventAuth.isModerator ? styles.desktopOnly : undefined}
          />
          {eventAuth.isModerator && (
            <Button
              icon={<ImageMinus />}
              iconPosition="right"
              data-color="brand-purple"
              variant="primary"
              onClick={() => router.push(`./${eventId}/moderate`)}
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
        <p role="alert" className={`${styles.errorText} ${styles.desktopOnly}`}>
          {uploadError ?? ""}
        </p>
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
          />
        </div>
      </div>

      {!isLoading && !isImagesLoading && images.length === 0 ? (
        <div role="status" className={styles.emptyState}>
          {tUpload("emptyState")}
        </div>
      ) : (
        <>
          <div className={styles.grid}>
            {images.map((image, index) => (
              <ImageCard
                key={image.id}
                variant="preview2"
                src={`/api/events/${eventId}/images/${image.id}`}
                alt={tUpload("imageAlt", { index: index + 1, total: images.length })}
                title={tUpload("imageTitle", { index: index + 1 })}
                data-image-id={image.id}
                onClick={() => handleImagePreview(index)}
              />
            ))}
          </div>
          {hasNextPage ? (
            <div ref={loadMoreRef} className={styles.loadMoreSentinel} />
          ) : null}
        </>
      )}
    </>
  );
}
