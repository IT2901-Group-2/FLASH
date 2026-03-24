"use client";
import { useEffect, useRef, useState } from "react";
import { QrCode, Upload } from "lucide-react";
import styles from "./UploadImage.module.css";
import { ActionCard, Button, Dialog, ImageCard, QRDisplay } from "@flash/ui";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { useEventCodeQuery, useEventsQuery } from "@/hooks/useEvents";
import { useImagesQuery, useUploadImageMutation } from "@/hooks/useImages";
import { useEventAuth } from "@/providers/EventAuthContext";
import { PhoneHeader } from "@/components/PhoneHeader/PhoneHeader";
import { getAdminDashboardEventRoute, routes } from "@/lib/routes";
import Image from "next/image";

export default function Page() {
  const router = useRouter();
  const tCommon = useTranslations("common");
  const tUpload = useTranslations("guest.event.upload");
  const eventAuth = useEventAuth();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const previewDialogRef = useRef<HTMLDialogElement>(null);

  // Event Data
  const { id: eventId } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useEventsQuery(
    eventId ? { id: [eventId] } : undefined
  );
  const eventData = data?.[0];

  // Image Data
  const { data: imagesData } = useImagesQuery(eventId);
  const images = imagesData ?? [];

  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<{ src: string; alt: string } | null>(
    null
  );
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
  const uploadsRemaining =
    typeof eventData?.uploadLimit === "number" ? eventData.uploadLimit : undefined;

  const uploadDescription = tUpload("description", {
    uploadsRemaining:
      typeof uploadsRemaining === "number" ? uploadsRemaining : tUpload("unlimited"),
  });

  const backHref = eventAuth.isModerator
    ? getAdminDashboardEventRoute(eventId)
    : routes.root;

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
        if (failureCount > 0) {
          setUploadError(tUpload("errors.uploadFailed", { count: failureCount }));
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
    if (!isPreviewOpen) return;

    const previousOverflow = document.body.style.overflow;
    const previousOverscrollBehavior = document.body.style.overscrollBehavior;

    document.body.style.overflow = "hidden";
    document.body.style.overscrollBehavior = "none";

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.overscrollBehavior = previousOverscrollBehavior;
    };
  }, [isPreviewOpen]);

  useEffect(() => {
    const dialog = previewDialogRef.current;
    if (!dialog) return;

    const handleClose = () => setIsPreviewOpen(false);
    dialog.addEventListener("close", handleClose);

    return () => dialog.removeEventListener("close", handleClose);
  }, []);

  const handleImagePreview = (src: string, alt: string) => {
    setPreviewImage({ src, alt });
    setIsPreviewOpen(true);
    previewDialogRef.current?.showModal();
  };

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

      <Dialog
        ref={previewDialogRef}
        closedby="any"
        className={styles.previewDialog}
        style={{ width: "min(92vw, 900px)", maxWidth: "92vw", marginTop: 0 }}
      >
        {previewImage && (
          <>
            <div className={styles.previewImage}>
              <Image
                fill
                src={previewImage.src}
                alt={previewImage.alt}
                className={styles.previewImageInner}
                sizes="(max-width: 900px) 92vw, 900px"
              />
            </div>
            <Button
              variant="secondary"
              data-color="neutral"
              onClick={() => {
                setIsPreviewOpen(false);
                previewDialogRef.current?.close();
              }}
              fill
            >
              {tCommon("actions.close")}
            </Button>
          </>
        )}
      </Dialog>

      <div className={styles.pageWrapper}>
        <PhoneHeader
          title={eventName}
          username={eventAuth?.nickname ?? ""}
          description={uploadDescription}
          backHref={backHref}
        >
          <Button
            icon={<QrCode />}
            iconPosition="right"
            data-color="brand-purple"
            variant="secondary"
            onClick={() => dialogRef.current?.showModal()}
          />
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
          {images.map((image, index) => (
            <ImageCard
              key={image.id}
              variant="preview2"
              src={`/api/events/${eventId}/images/${image.id}`}
              alt={tUpload("imageAlt", { index: index + 1, total: images.length })}
              title={tUpload("imageTitle", { index: index + 1 })}
              data-image-id={image.id}
              onClick={() =>
                handleImagePreview(
                  `/api/events/${eventId}/images/${image.id}`,
                  tUpload("imageAlt", { index: index + 1, total: images.length })
                )
              }
            />
          ))}
        </div>
      )}
    </>
  );
}
