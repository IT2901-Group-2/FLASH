"use client";

import styles from "./PhoneHeader.module.css";
import { Button, Dialog, QRDisplay, Title, useToast } from "@flash/ui";
import { Download, ImageMinus, OctagonAlert, QrCode, Upload, User } from "lucide-react";
import BaseHeader, { BaseHeaderProps } from "./BaseHeader";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useEventCodeQuery, useEventsQuery } from "@/hooks/useEvents";
import { useParams, useRouter } from "next/navigation";
import { useEventAuth } from "@/providers/EventAuthContext";
import { useDownloadImagesMutation, useUploadImageMutation } from "@/hooks/useImages";
import { useFileUpload } from "@/hooks/useFileUpload";
import { getUploadErrorMessageDescriptor } from "@/utils/fileUploadErrorMessages";
import { EVENT_REFETCH_INTERVAL, MAX_IMAGE_SIZE } from "@/config";

export interface PhoneHeaderProps extends BaseHeaderProps {
  /**
   * The title of the event.
   */
  title: string;
  /**
   * Current loged in user. Will be displayed next to user icon.
   */
  username: string;
  /**
   * The description in the header. This will be hidden on small screens.
   */
  description?: string;
  /**
   * Child elements inside the header
   */
  children?: React.ReactNode;
}

export const PhoneHeader = ({
  title,
  description,
  username,
  ...rest
}: PhoneHeaderProps) => {
  const t = useTranslations("common");
  const tUpload = useTranslations("guest.event.upload");
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { id: eventId } = useParams<{ id: string }>();
  const eventAuth = useEventAuth();
  const { mutate: downloadImages } = useDownloadImagesMutation();
  const { mutateAsync: uploadImage } = useUploadImageMutation();
  const { createToast } = useToast();
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const { data } = useEventsQuery(
    eventId ? { id: [eventId] } : undefined,
    undefined,
    EVENT_REFETCH_INTERVAL
  );
  const eventData = data?.pages[0]?.items[0];

  // Join Code
  const { data: joinCode } = useEventCodeQuery(eventId, "guest");
  const [joinLink, setJoinLink] = useState<string | null>(null);
  useEffect(() => {
    (async () =>
      setJoinLink(new URL(`/join/${joinCode}`, window.location.origin).href))();
  }, [setJoinLink, joinCode]);

  const errorToast = useCallback(
    (message: string) =>
      createToast({
        title: tUpload("errors.uploadFailedTitle"),
        description: message,
        icon: <OctagonAlert />,
        "data-color": "danger",
        duration: 5000,
      }),
    [createToast, tUpload]
  );

  const handleFilesSelected = (files: File[]) => {
    if (!eventId) return errorToast(tUpload("errors.uploadUnavailable"));
    setIsUploading(true);

    Promise.all([
      Promise.allSettled(Array.from(files).map(file => uploadImage({ eventId, file }))),
      new Promise(resolve => setTimeout(resolve, 650)),
    ])
      .then(([uploadResults]) => {
        const uploadErrorDescriptor = getUploadErrorMessageDescriptor(uploadResults, {
          maxFileSize: MAX_IMAGE_SIZE,
        });

        if (uploadErrorDescriptor) {
          const errorValues =
            "values" in uploadErrorDescriptor ? uploadErrorDescriptor.values : undefined;
          errorToast(tUpload(uploadErrorDescriptor.key, errorValues));
        }
      })
      .catch(e => console.error("Unexpected upload error:", e))
      .finally(() => setIsUploading(false));
  };

  const { openFilePicker, FileInput } = useFileUpload({
    multiple: false,
    onFilesSelected: handleFilesSelected,
  });

  const isEnded = eventData ? new Date() > eventData.endDate : false;

  return (
    <>
      <FileInput />
      <Dialog ref={dialogRef} closedby="any" className={styles.qrCodeContainer}>
        <div className={styles.qrCodeContainer}>
          {joinLink !== null && (
            <QRDisplay
              value={joinLink}
              size="large"
              helperText={t("messages.scanToUploadPhotos")}
              code={joinCode}
            />
          )}
          <Button
            variant="secondary"
            data-color="neutral"
            onClick={() => dialogRef.current?.close()}
            fill
          >
            {t("actions.close")}
          </Button>
        </div>
      </Dialog>

      <BaseHeader {...rest}>
        <div className={styles.titleBlock}>
          <Title size="small" as="h1">
            {title}
          </Title>
          <span className={styles.user}>
            <User />
            <span className={styles.truncate}>{username}</span>
          </span>
          <span>{description}</span>
        </div>
        <span className={styles.childSection}>
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
              {t("actions.moderate")}
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
            {isEnded ? t("actions.downloadImages") : t("actions.uploadImage")}
          </Button>
        </span>
      </BaseHeader>
    </>
  );
};

export default PhoneHeader;
