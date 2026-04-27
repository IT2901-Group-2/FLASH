"use client";
import { useEffect, useRef, useState } from "react";
import { Download, ImageMinus, QrCode, Upload } from "lucide-react";
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
import { ImagePreview } from "@/components/ImagePreview/ImagePreview";
import { getImageSrc } from "@/lib/utils/images";

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
  const eventData = data?.[0];

  // Image Data
  const { data: imagesData } = useImagesQuery(eventId, { approval: "approved" });
  const images = imagesData ?? [];
  const { data: uploadedCountData } = useUploadedImageCountQuery(eventId);

  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
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

  const handleImagePreview = (index: number) => setPreviewIndex(index);

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

      if (images.length <= 1) return;

      if (event.key === "ArrowRight") {
        event.preventDefault();
        setPreviewIndex(currentIndex =>
          currentIndex === null ? null : (currentIndex + 1) % images.length
        );
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setPreviewIndex(currentIndex =>
          currentIndex === null
            ? null
            : (currentIndex - 1 + images.length) % images.length
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [images.length, previewIndex]);

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

      <ImagePreview
        eventId={eventId}
        images={images}
        previewIndex={previewIndex}
        setPreviewIndex={setPreviewIndex}
        getImageAlt={(index, total) => tUpload("imageAlt", { index: index + 1, total })}
      />

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

      {!isLoading && images.length === 0 ? (
        <div role="status" className={styles.emptyState}>
          {tUpload("emptyState")}
        </div>
      ) : (
        <div className={styles.grid}>
          {images.map((image, index) => (
            <ImageCard
              key={image.id}
              variant="preview2"
              src={getImageSrc(eventId, image.id, { width: 200, height: 200 })}
              alt={tUpload("imageAlt", { index: index + 1, total: images.length })}
              title={tUpload("imageTitle", { index: index + 1 })}
              data-image-id={image.id}
              placeholder={image.previewImage}
              onClick={() => handleImagePreview(index)}
            />
          ))}
        </div>
      )}
    </>
  );
}
