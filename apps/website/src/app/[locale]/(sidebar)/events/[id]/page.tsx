"use client";
import { ImagePreview, ImagePreviewHandle } from "@/components/ImagePreview/ImagePreview";
import PhoneHeader from "@/components/Headers/PhoneHeader";
import { PhotoList } from "@/components/PhotoList/PhotoList";
import {
  EVENT_REFETCH_INTERVAL,
  MAX_IMAGE_SIZE,
  PHOTOS_REFETCH_INTERVAL,
} from "@/config/images";
import { useEventCodeQuery, useEventsQuery } from "@/hooks/useEvents";
import { useFileUpload } from "@/hooks/useFileUpload";
import {
  useDownloadImagesMutation,
  useImagesQuery,
  useMyImagesQuery,
  useUploadImageMutation,
  useUploadedImageCountQuery,
} from "@/hooks/useImages";
import { useEventAuth } from "@/providers/EventAuthContext";
import { getUploadErrorMessageDescriptor } from "@/utils/fileUploadErrorMessages";
import {
  ActionCard,
  Button,
  Dialog,
  QRDisplay,
  SegmentedControl,
  Title,
  useToast,
} from "@flash/ui";
import {
  ChevronRight,
  Download,
  ImageMinus,
  OctagonAlert,
  QrCode,
  Upload,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import styles from "./UploadImage.module.css";

const IMAGE_PAGE_SIZE = 12;
const maxFileSizeInMb = Math.ceil(MAX_IMAGE_SIZE / (1024 * 1024)); //TODO: Move this to a more appropriate location

export default function Page() {
  const router = useRouter();
  const tCommon = useTranslations("common");
  const tUpload = useTranslations("guest.event.upload");
  const { createToast } = useToast();
  const eventAuth = useEventAuth();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const imagePreviewRef = useRef<ImagePreviewHandle>(null);
  const { mutate: downloadImages } = useDownloadImagesMutation();
  const { mutateAsync: uploadImage } = useUploadImageMutation();

  // Event Data
  const { id: eventId } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useEventsQuery(
    eventId ? { id: [eventId] } : undefined,
    undefined,
    EVENT_REFETCH_INTERVAL
  );
  const eventData = data?.pages[0]?.items[0];
  const uploadsArePrivate = eventData?.uploadsArePrivate ?? false;
  const [activeTab, setActiveTab] = useState<"all" | "user">("all");
  const showTabs = uploadsArePrivate || !!eventAuth.isModerator;
  const isShowingUserTab = !showTabs || activeTab === "user";

  const handleTabChange = (val: string) => {
    if (val === "all" || val === "user") setActiveTab(val);
  };

  const myImagesQuery = useMyImagesQuery(
    eventId,
    { pageSize: IMAGE_PAGE_SIZE },
    isShowingUserTab,
    PHOTOS_REFETCH_INTERVAL
  );

  const imagesQuery = useImagesQuery(
    eventId,
    { approval: "approved", pageSize: IMAGE_PAGE_SIZE },
    !isShowingUserTab,
    PHOTOS_REFETCH_INTERVAL
  );

  const activeQuery = isShowingUserTab ? myImagesQuery : imagesQuery;
  const displayedImages = activeQuery.data?.pages.flatMap(page => page.items) ?? [];

  const { data: uploadedCountData } = useUploadedImageCountQuery(eventId);

  const [isUploading, setIsUploading] = useState(false);

  const showUploadErrorToast = (message: string) => {
    createToast({
      id: "upload-error-toast",
      title: tUpload("errors.uploadFailedTitle"),
      description: message,
      icon: <OctagonAlert />,
      "data-color": "danger",
      duration: 5000,
    });
  };

  // Join Code
  const { data: joinCode } = useEventCodeQuery(eventId, "guest");
  const [joinLink, setJoinLink] = useState<string | null>(null);
  useEffect(() => {
    (async () =>
      setJoinLink(new URL(`/join/${joinCode}`, window.location.origin).href))();
  }, [setJoinLink, joinCode]);

  //Event date data
  const isEnded = eventData ? new Date() > eventData.endDate : false;

  // Translation strings
  const eventName =
    eventData?.name ??
    (isLoading ? tUpload("loadingEvent") : tUpload("eventFallbackName"));

  const userImageCount = uploadedCountData?.count ?? 0;

  const uploadsRemaining =
    typeof eventData?.uploadLimit === "number"
      ? Math.max(0, eventData.uploadLimit - userImageCount)
      : undefined;

  const uploadDescription = isEnded
    ? tCommon("uploads.eventEnded")
    : typeof uploadsRemaining !== "number"
      ? tCommon("uploads.unlimited.long")
      : uploadsRemaining === 0
        ? tCommon("uploads.none.long")
        : tCommon("uploads.remaining.long", { count: uploadsRemaining });

  // If/when this page is refactored and this function is extracted as its own util, the contents of
  // utils/fileUploadErrorMessages should possible be integrated into the new util as well
  const { openFilePicker, FileInput } = useFileUpload({
    multiple: false,
    onFilesSelected: async files => {
      if (!eventId) {
        showUploadErrorToast(tUpload("errors.uploadUnavailable"));
        return;
      }

      setIsUploading(true);

      try {
        const [results] = await Promise.all([
          Promise.allSettled(
            Array.from(files).map(file => uploadImage({ eventId, file }))
          ),
          new Promise(resolve => setTimeout(resolve, 650)),
        ]);
        const uploadErrorDescriptor = getUploadErrorMessageDescriptor(results, {
          maxFileSize: maxFileSizeInMb,
        });

        if (uploadErrorDescriptor) {
          showUploadErrorToast(
            tUpload(
              uploadErrorDescriptor.key,
              "values" in uploadErrorDescriptor ? uploadErrorDescriptor.values : undefined
            )
          );
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

      <ImagePreview ref={imagePreviewRef} images={displayedImages} />

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
          {eventAuth.isModerator && (
            <Button
              icon={<ImageMinus />}
              iconPosition="right"
              data-color="brand-purple"
              variant="primary"
              onClick={() => router.push(`./${eventId}/moderate`)}
              className={styles.desktopOnly}
            >
              {tCommon("actions.moderate")}
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
            {isEnded ? tCommon("actions.downloadImages") : tCommon("actions.uploadImage")}
          </Button>
        </PhoneHeader>
        {!isLoading && (isError || !eventData) ? (
          <p className={styles.errorText}>{tUpload("eventLoadFailed")}</p>
        ) : null}
        <div className={styles.mobileOnly}>
          <ActionCard
            data-testid="action-card"
            description={uploadDescription}
            primaryButton={{
              "data-color": "brand-purple",
              icon: isEnded ? <Download size={18} /> : <Upload size={18} />,
              iconPosition: "right",
              text: isEnded
                ? tCommon("actions.downloadImages")
                : tCommon("actions.uploadImage"),
              onClick: isEnded ? () => downloadImages({ eventId }) : openFilePicker,
              loading: isUploading,
            }}
            secondaryButton={
              eventAuth.isModerator
                ? {
                    icon: <ImageMinus />,
                    iconPosition: "right",
                    "data-color": "brand-purple",
                    variant: "secondary",
                    text: "Moderate",
                    onClick: () => router.push(`./${eventId}/moderate`),
                  }
                : undefined
            }
          />
        </div>
      </div>

      {showTabs && (
        <SegmentedControl
          fill
          className={styles.tabContainer}
          value={activeTab}
          onChange={handleTabChange}
        >
          <SegmentedControl.Item value="all" label={tUpload("tabs.allPhotos")} />
          <SegmentedControl.Item value="user" label={tUpload("tabs.userPhotos")} />
        </SegmentedControl>
      )}

      <div className={styles.sectionTitleRow}>
        <Title as="h2" className={styles.sectionTitle}>
          {isShowingUserTab ? tUpload("tabs.userPhotos") : tUpload("tabs.allPhotos")}
        </Title>
        {!isShowingUserTab && (
          <Button
            variant="secondary"
            icon={<ChevronRight />}
            iconPosition="right"
            className={styles.slideshowButton}
            onClick={() => router.push(`./${eventId}/slideshow`)}
          >
            {tCommon("actions.slideshow")}
          </Button>
        )}
      </div>
      <PhotoList
        eventId={eventId}
        query={isShowingUserTab ? myImagesQuery : imagesQuery}
        loadingText={
          isShowingUserTab ? tUpload("userPhotosEmptyState") : tUpload("emptyState")
        }
        onClick={({ index }) => imagePreviewRef.current?.open(index)}
        setState={({ isApproved }) =>
          isApproved === null ? "pending" : isApproved === false ? "rejected" : undefined
        }
      />
    </>
  );
}
