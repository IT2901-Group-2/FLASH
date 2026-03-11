"use client";
import { useEffect, useRef, useState } from "react";
import { Camera, QrCode, Upload } from "lucide-react";
import styles from "./UploadImage.module.css";
import { ActionCard, Button, Dialog, ImageCard, QRDisplay } from "ui";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { useEventCodeQuery, useEventsQuery } from "@/hooks/useEvents";
import { useImagesQuery, useUploadImageMutation } from "@/hooks/useImages";
import { useEventAuth } from "@/providers/EventAuthContext";
import { PhoneHeader } from "@/components/PhoneHeader/PhoneHeader";

export default function Page() {
  const router = useRouter();
  const t = useTranslations("EventPage");
  const { id } = useParams<{ id: string }>();
  const eventId = typeof id === "string" ? id : "";
  const eventAuth = useEventAuth();
  const { data, isLoading, isError } = useEventsQuery(
    eventId ? { id: [eventId] } : undefined
  );
  const { data: imagesData } = useImagesQuery(eventId);
  const images = imagesData ?? [];

  const [uploadError, setUploadError] = useState<string | null>(null);
  const { mutateAsync: uploadImage } = useUploadImageMutation();

  const eventData = data?.[0];
  const eventName = eventData?.name ?? (isLoading ? "Loading event..." : "Event");
  const uploadsRemaining =
    typeof eventData?.uploadLimit === "number" ? eventData.uploadLimit : undefined;

  const { data: joinCode } = useEventCodeQuery(
    eventId,
    eventAuth.isModerator ? "moderator" : "guest"
  );

  const [joinLink, setJoinLink] = useState<string | null>(null);
  useEffect(() => {
    (async () =>
      setJoinLink(new URL(`/join/${joinCode}`, window.location.origin).href))();
  }, [setJoinLink, joinCode]);

  const dialogRef = useRef<HTMLDialogElement>(null);
  const uploadDescription = t("uploadDescription", {
    uploadsRemaining:
      typeof uploadsRemaining === "number" ? uploadsRemaining : "unlimited",
  });

  const { openFilePicker, FileInput } = useFileUpload({
    onFilesSelected: async files => {
      if (!eventId) {
        setUploadError("Unable to upload images for this event.");
        return;
      }

      setUploadError(null);

      const results = await Promise.allSettled(
        Array.from(files).map(file => uploadImage({ eventId, file }))
      );

      if (results.some(result => result.status === "rejected")) {
        setUploadError("One or more images failed to upload. Please try again.");
      }
    },
  });

  useEffect(() => {
    if (eventAuth !== undefined && !eventAuth.isAuthenticated) {
      router.push("/");
    }
  }, [eventAuth, router]);

  return (
    <>
      <FileInput />
      <Dialog ref={dialogRef} className={styles.qrCodeContainer}>
        <div className={styles.qrCodeContainer}>
          {joinLink !== null && <QRDisplay value={joinLink} size="large" />}
          <Button
            variant="secondary"
            data-color="neutral"
            onClick={() => dialogRef.current?.close()}
            fill
          >
            Close
          </Button>
        </div>
      </Dialog>

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
          <Button
            icon={<Camera />}
            iconPosition="right"
            data-color="brand-purple"
            variant="secondary"
            className={styles.desktopOnly}
          >
            {t("actions.takePhoto")}
          </Button>
          <Button
            icon={<Upload />}
            iconPosition="right"
            data-color="brand-purple"
            variant="primary"
            onClick={openFilePicker}
            className={styles.desktopOnly}
          >
            {t("actions.uploadImage")}
          </Button>
        </PhoneHeader>
        {!isLoading && (isError || !eventData) ? (
          <p className={styles.errorText}>Could not load event details for this link.</p>
        ) : null}
        {uploadError ? <p className={styles.errorText}>{uploadError}</p> : null}
        <div className={styles.mobileOnly}>
          <ActionCard
            description={uploadDescription}
            primaryButton={{
              "data-color": "brand-purple",
              icon: <Upload size={18} />,
              iconPosition: "right",
              text: t("actions.uploadImage"),
              onClick: openFilePicker,
            }}
            secondaryButton={{
              "data-color": "brand-purple",
              icon: <Camera size={18} />,
              iconPosition: "right",
              text: t("actions.takePhoto"),
            }}
          />
        </div>
      </div>

      {!isLoading && images.length === 0 ? (
        <div role="status" className={styles.emptyState}>
          No photos found
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
              data-image-id={image.id}
            />
          ))}
        </div>
      )}
    </>
  );
}
