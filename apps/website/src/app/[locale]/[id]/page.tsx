"use client";
import { ArrowLeft, Camera, Upload } from "lucide-react";
import styles from "./UploadImage.module.css";
import { ActionCard, PhoneHeader } from "ui";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useEventsQuery } from "@/hooks/useEvents";

export default function Page() {
  const t = useTranslations("EventPage");
  const { id } = useParams<{ id: string }>();
  const eventId = typeof id === "string" ? id : "";
  const { data, isLoading, isError } = useEventsQuery(
    eventId ? { id: [eventId] } : undefined
  );
  const eventData = data?.[0];

  const eventName = eventData?.name ?? (isLoading ? "Loading event..." : "Event");
  // TODO: Nickname should be added later in join event card, for now we can just show the guest code if it exists
  const nickname = eventData?.guestCode ? `Code: ${eventData.guestCode}` : "Guest";
  const uploadsRemaining =
    typeof eventData?.uploadLimit === "number" ? eventData.uploadLimit : undefined;

  const uploadsDescription =
    typeof uploadsRemaining === "number"
      ? `You have ${uploadsRemaining} uploads remaining`
      : "You have an unlimited number of uploads";

  const { openFilePicker, FileInput } = useFileUpload({
    onFilesSelected: files => {
      console.log("Selected files:", files);
      // TODO: Handle file upload logic here
    },
  });

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
      ></PhoneHeader>
      {!isLoading && (isError || !eventData) ? (
        <p className={styles.errorText}>Could not load event details for this link.</p>
      ) : null}
      <ActionCard
        className={styles.mobileOnly}
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
