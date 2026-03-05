"use client";
import { useEffect, useState } from "react";
import { ArrowLeft, Camera, Upload } from "lucide-react";
import styles from "./UploadImage.module.css";
import { ActionCard, ImageCard, PhoneHeader } from "ui";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useTranslations } from "next-intl";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useEventCodeQuery, useEventsQuery } from "@/hooks/useEvents";
import { useImagesQuery, useUploadImageMutation } from "@/hooks/useImages";
import { hasNicknameForEvent } from "@/hooks/useRememberEvents";

export default function Page() {
  const navigation = useRouter();
  const t = useTranslations("EventPage");
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const eventId = typeof id === "string" ? id : "";
  const [uploadError, setUploadError] = useState<string | null>(null);
  const { data, isLoading, isError } = useEventsQuery(
    eventId ? { id: [eventId] } : undefined
  );
  const { mutateAsync: uploadImage } = useUploadImageMutation();
  const { data: images } = useImagesQuery(eventId);
  const { data: guestCode } = useEventCodeQuery(eventId, "guest");
  const eventData = data?.[0];

  const eventName = eventData?.name ?? (isLoading ? "Loading event..." : "Event");
  const nicknameParam = searchParams.get("nickname")?.trim();
  const nickname =
    nicknameParam && nicknameParam.length > 0
      ? nicknameParam
      : guestCode !== undefined
        ? `Code: ${guestCode}`
        : "Guest";
  const uploadsRemaining =
    typeof eventData?.uploadLimit === "number" ? eventData.uploadLimit : undefined;

  const uploadsDescription =
    typeof uploadsRemaining === "number"
      ? `You have ${uploadsRemaining} uploads remaining`
      : "You have an unlimited number of uploads";

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
  const [isQrOpen, setIsQrOpen] = useState(false);

  useEffect(() => {
    if (!hasNicknameForEvent(eventId)) navigation.push(`/${eventId}/nickname`);
  }, [eventId, navigation]);

  return (
    <div className={styles.pageWrapper}>
      <FileInput />
      <PhoneHeader
        title={eventName}
        subtitle={nickname}
        rightLabel="Live"
        rightVariant="primary"
        rightAriaLabel="live-button"
        leftIcon={<ArrowLeft />}
        leftAriaLabel="back-button"
        uploadsRemaining={uploadsRemaining}
        onPrimaryClick={openFilePicker}
        primaryText={t("actions.uploadImage")}
        secondaryText={t("actions.takePhoto")}
        onQrOpenChange={setIsQrOpen}
      ></PhoneHeader>
      {!isLoading && (isError || !eventData) ? (
        <p className={styles.errorText}>Could not load event details for this link.</p>
      ) : null}
      {uploadError ? <p className={styles.errorText}>{uploadError}</p> : null}

      <div className={styles.imageSection}>
        {images && images.length > 0 ? (
          <div className={styles.imageGrid}>
            {images.map((image, index) => (
              <ImageCard
                key={image.id}
                size="large"
                src={`/api/events/${eventId}/images/${image.id}`}
                alt={`Uploaded image ${index + 1}`}
                title={`Image ${index + 1}`}
              />
            ))}
          </div>
        ) : (
          <p className={styles.emptyText}>No images uploaded yet.</p>
        )}
      </div>

      <ActionCard
        className={`${styles.mobileOnly} ${isQrOpen ? styles.dimmed : ""}`}
        description={uploadsDescription}
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
  );
}
