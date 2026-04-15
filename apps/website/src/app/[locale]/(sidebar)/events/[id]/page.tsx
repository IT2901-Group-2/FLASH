"use client";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ImageMinus, QrCode, Upload, X } from "lucide-react";
import styles from "./UploadImage.module.css";
import { ActionCard, Button, Dialog, QRDisplay } from "@flash/ui";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { useEventCodeQuery, useEventsQuery } from "@/hooks/useEvents";
import { useEventAuth } from "@/providers/EventAuthContext";
import { PhoneHeader } from "@/components/PhoneHeader/PhoneHeader";
import {
  useImagesQuery,
  useUploadedImageCountQuery,
  useUploadImageMutation,
} from "@/hooks/useImages";
import Image from "next/image";

export default function Page() {
  const router = useRouter();
  const tCommon = useTranslations("common");
  const tUpload = useTranslations("guest.event.upload");
  const eventAuth = useEventAuth();
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Event Data
  const { id: eventId } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useEventsQuery(
    eventId ? { id: [eventId] } : undefined
  );
  const eventData = data?.[0];

  // Image Data
  const { data: imagesData } = useImagesQuery(eventId, { approval: "approved" });
  const images = imagesData ?? [];
  const { data: uploadedCountData } = useUploadedImageCountQuery(eventId);

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

  // Translation strings
  const eventName =
    eventData?.name ??
    (isLoading ? tUpload("loadingEvent") : tUpload("eventFallbackName"));

  const userImageCount = uploadedCountData?.count ?? 0;

  const uploadsRemaining =
    typeof eventData?.uploadLimit === "number"
      ? Math.max(0, eventData.uploadLimit - userImageCount)
      : undefined;

  const uploadDescription =
    typeof uploadsRemaining !== "number"
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
          />
          <Button
            className={styles.previewClose}
            onClick={closePreview}
            variant="icon"
            icon={<X />}
          />
          {images.length > 1 && (
            <>
              <button>
                <ChevronLeft />
              </button>
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
            icon={<Upload />}
            iconPosition="right"
            data-color="brand-purple"
            variant="primary"
            onClick={openFilePicker}
            loading={isUploading}
            className={styles.desktopOnly}
          >
            {tCommon("actions.uploadImage")}
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
              icon: <Upload size={18} />,
              iconPosition: "right",
              text: tCommon("actions.uploadImage"),
              onClick: openFilePicker,
              loading: isUploading,
            }}
          />
        </div>
      </div>

      {!isLoading && images.length === 0 ? (
        <div role="status" className={styles.emptyState}>
          {tUpload("emptyState")}
        </div>
      ) : (
        <div className={styles.grid}>
          {images.map(image => (
            <div
              key={image.id}
              className={styles.cell}
              onClick={() => setPreviewIndex(images.indexOf(image))}
            >
              <Image
                src={`/api/events/${eventId}/images/${image.id}`}
                alt=""
                fill
                className={styles.image}
                placeholder="blur"
                blurDataURL={image.previewImage}
                sizes="(max-width: 768px) 66vw, 33vw"
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
