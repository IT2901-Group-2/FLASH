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
  const tCommon = useTranslations("common");
  const tUpload = useTranslations("guest.event.upload");
  const { id } = useParams<{ id: string }>();
  const eventId = typeof id === "string" ? id : "";
  const eventAuth = useEventAuth();
  const { data, isLoading, isError } = useEventsQuery(
    eventId ? { id: [eventId] } : undefined
  );
  const eventData = data?.[0];
  const eventName =
    eventData?.name ??
    (isLoading ? tUpload("loadingEvent") : tUpload("eventFallbackName"));
  const uploadsRemaining =
    typeof eventData?.uploadLimit === "number" ? eventData.uploadLimit : undefined;

  const dialogRef = useRef<HTMLDialogElement>(null);
  const uploadDescription = tUpload("description", {
    uploadsRemaining:
      typeof uploadsRemaining === "number" ? uploadsRemaining : tUpload("unlimited"),
  });

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
          <QRDisplay
            value="www.example.com"
            size="large"
            helperText={tCommon("messages.scanToUploadPhotos")}
          />
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
            {tCommon("actions.takePhoto")}
          </Button>
          <Button
            icon={<Upload />}
            iconPosition="right"
            data-color="brand-purple"
            variant="primary"
            onClick={openFilePicker}
            className={styles.desktopOnly}
          >
            {tCommon("actions.uploadImage")}
          </Button>
        </PhoneHeader>
        {!isLoading && (isError || !eventData) ? (
          <p className={styles.errorText}>{tUpload("eventLoadFailed")}</p>
        ) : null}
        <ActionCard
          className={`${styles.mobileOnly}`}
          description={uploadDescription}
          primaryButton={{
            "data-color": "brand-purple",
            icon: <Upload size={18} />,
            iconPosition: "right",
            text: tCommon("actions.uploadImage"),
            onClick: openFilePicker,
          }}
          secondaryButton={{
            "data-color": "brand-purple",
            icon: <Camera size={18} />,
            iconPosition: "right",
            text: tCommon("actions.takePhoto"),
          }}
        />
      </div>
    </>
  );
}
