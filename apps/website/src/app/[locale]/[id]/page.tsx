"use client";
import { useEffect, useRef } from "react";
import { Camera, QrCode, Upload } from "lucide-react";
import styles from "./UploadImage.module.css";
import { ActionCard, Button, Dialog, QRDisplay } from "ui";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { useEventsQuery } from "@/hooks/useEvents";
import { useEventAuth } from "@/providers/EventAuthContext";
import PhoneHeader from "@/components/PhoneHeader/PhoneHeader";

export default function Page() {
  const router = useRouter();
  const t = useTranslations("EventPage");
  const { id } = useParams<{ id: string }>();
  const eventId = typeof id === "string" ? id : "";
  const eventAuth = useEventAuth();
  const { data, isLoading, isError } = useEventsQuery(
    eventId ? { id: [eventId] } : undefined
  );
  const eventData = data?.[0];
  const eventName = eventData?.name ?? (isLoading ? "Loading event..." : "Event");
  const uploadsRemaining =
    typeof eventData?.uploadLimit === "number" ? eventData.uploadLimit : undefined;

  const dialogRef = useRef<HTMLDialogElement>(null);
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
          <QRDisplay value="www.example.com" size="large" />
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
          description={uploadsDescription}
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
        <ActionCard
          className={`${styles.mobileOnly}`}
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
    </>
  );
}
