"use client";
import { useCallback, useEffect, useRef, useState } from "react";
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

// Used for pilot feedback collection. Should be removed after pilot is finished
const SURVEY_LINK = "https://nettskjema.no/a/610540";
const SURVEY_UPLOAD_THRESHOLD = 3;

export default function Page() {
  const router = useRouter();
  const tCommon = useTranslations("common");
  const tUpload = useTranslations("guest.event.upload");
  const eventAuth = useEventAuth();
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Event Data
  const eventId = useParams<{ id: string }>().id;
  const { data, isLoading, isError } = useEventsQuery(
    eventId ? { id: [eventId] } : undefined
  );
  const eventData = data?.[0];

  // Image Data
  const { data: imagesData } = useImagesQuery(eventId);
  const images = imagesData ?? [];

  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
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

  // Start of survey popup logic
  // TODO: For pilot release. Should be removed after pilot is finished
  const surveyDialogRef = useRef<HTMLDialogElement>(null);

  const userStorageId = eventAuth.isAuthenticated
    ? `${eventAuth.nickname}:${eventAuth.isModerator ? "moderator" : "guest"}`
    : "anonymous";
  const uploadCountStorageKey = `uploaded-photo-count:${userStorageId}`;
  const surveyShownStorageKey = `uploaded-photo-survey-shown:${userStorageId}`;

  // Helpers for survey popup logic
  const getStoredUploadCount = useCallback(() => {
    const raw = window.localStorage.getItem(uploadCountStorageKey);
    const value = raw ? Number.parseInt(raw, 10) : 0;
    return Number.isFinite(value) && value >= 0 ? value : 0;
  }, [uploadCountStorageKey]);

  const hasShownSurveyPopup = useCallback(
    () => window.localStorage.getItem(surveyShownStorageKey) === "true",
    [surveyShownStorageKey]
  );

  const maybeShowSurveyPopup = useCallback(
    (uploadedPhotoCount: number) => {
      if (uploadedPhotoCount < SURVEY_UPLOAD_THRESHOLD || hasShownSurveyPopup()) {
        return;
      }

      window.localStorage.setItem(surveyShownStorageKey, "true");
      surveyDialogRef.current?.showModal();
    },
    [hasShownSurveyPopup, surveyShownStorageKey]
  );

  useEffect(() => {
    if (!eventAuth.isAuthenticated) return;
    maybeShowSurveyPopup(getStoredUploadCount());
  }, [eventAuth.isAuthenticated, getStoredUploadCount, maybeShowSurveyPopup]);
  // End of survey popup logic

  const uploadDescription = tUpload("description", {
    uploadsRemaining:
      typeof uploadsRemaining === "number" ? uploadsRemaining : tUpload("unlimited"),
  });

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
        if (successfulUploads > 0) {
          const nextUploadCount = getStoredUploadCount() + successfulUploads;
          window.localStorage.setItem(uploadCountStorageKey, String(nextUploadCount));
          maybeShowSurveyPopup(nextUploadCount);
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

  return (
    <>
      <FileInput />
      <Dialog ref={dialogRef} className={styles.qrCodeContainer}>
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

      {/* Start of survey popup logic. Should be removed after pilot */}
      <Dialog ref={surveyDialogRef} className={styles.surveyDialog}>
        <div className={styles.surveyDialog}>
          <h2 className={styles.surveyTitle}>{tUpload("survey.title")}</h2>
          <p className={styles.surveyText}>{tUpload("survey.descriptionLead")}</p>
          <p className={styles.surveyText}>{tUpload("survey.descriptionDetails")}</p>
          <Button
            variant="primary"
            data-color="brand-purple"
            onClick={() => window.open(SURVEY_LINK, "_blank", "noopener,noreferrer")}
            fill
          >
            {tUpload("survey.cta")}
          </Button>
          <Button
            variant="secondary"
            data-color="neutral"
            onClick={() => surveyDialogRef.current?.close()}
            fill
          >
            {tCommon("actions.close")}
          </Button>
        </div>
      </Dialog>
      {/* End of survey popup logic */}

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
            />
          ))}
        </div>
      )}
    </>
  );
}
