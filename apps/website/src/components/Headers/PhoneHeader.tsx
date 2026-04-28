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
import { useDownloadImagesMutation, useUploadedImageCountQuery } from "@/hooks/useImages";
import { useFileUpload } from "@/hooks/useFileUpload";
import { EVENT_REFETCH_INTERVAL, MAX_IMAGE_SIZE, TOAST_DISPLAY_TIME } from "@/config";
import { getUploadsRemaining, hasEnded } from "@/utils/event-utils";

// export interface PhoneHeaderProps extends BaseHeaderProps {}

export const PhoneHeader = ({ ...rest }: BaseHeaderProps) => {
  const t = useTranslations("common");
  const tUpload = useTranslations("guest.event.upload");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { id: eventId } = useParams<{ id: string }>();
  const eventAuth = useEventAuth();
  const { mutate: downloadImages } = useDownloadImagesMutation();
  const { createToast } = useToast();
  const { data: uploadedCountData } = useUploadedImageCountQuery(eventId);

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
        duration: TOAST_DISPLAY_TIME,
      }),
    [createToast, tUpload]
  );

  const getUploadDescription = useCallback(
    (remaining: number | undefined, ended: boolean) => {
      if (ended) return tCommon("uploads.eventEnded");
      if (remaining === undefined) return tCommon("uploads.unlimited.long");
      if (remaining === 0) return tCommon("uploads.none.long");
      return tCommon("uploads.remaining.long", { count: remaining });
    },
    [tCommon]
  );

  const { openFilePicker, FileInput, isUploading } = useFileUpload({
    multiple: true,
    eventId,
    onError: e => errorToast(e.message),
    maxSizeBytes: MAX_IMAGE_SIZE,
  });

  if (!eventData) return;

  const isEnded = hasEnded(eventData);
  const uploadsRemaining = getUploadsRemaining(eventData, uploadedCountData?.count ?? 0);

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
            {eventData?.name}
          </Title>
          <span className={styles.user}>
            <User />
            <span className={styles.truncate}>{eventAuth.nickname}</span>
          </span>
          <span>{getUploadDescription(uploadsRemaining, isEnded)}</span>
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
