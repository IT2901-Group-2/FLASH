"use client";
import { useEffect, useState } from "react";
import { ArrowLeft, Camera, Upload } from "lucide-react";
import styles from "./UploadImage.module.css";
import { ActionCard, PhoneHeader } from "ui";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useTranslations } from "next-intl";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useEventCodeQuery, useEventsQuery } from "@/hooks/useEvents";
import { hasNicknameForEvent } from "@/hooks/useRememberEvents";

export default function Page() {
  const navigation = useRouter();
  const t = useTranslations("EventPage");
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const eventId = typeof id === "string" ? id : "";
  const { data, isLoading, isError } = useEventsQuery(
    eventId ? { id: [eventId] } : undefined
  );
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
    onFilesSelected: files => {
      console.log("Selected files:", files);
      // TODO: Handle file upload logic here
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
