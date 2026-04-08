"use client";

import { useEventCodeQuery, useEventsQuery } from "@/hooks/useEvents";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { QRDisplay, Title } from "@flash/ui";
import styles from "./slideshow.module.css";
import {
  ChevronLeft,
  ChevronRight,
  Expand,
  Pause,
  Play,
  QrCode,
  Shrink,
  X,
} from "lucide-react";
import { cl } from "@/utils/className";
import { useImagesQuery } from "@/hooks/useImages";
import Image from "next/image";
import { useIdle } from "@/hooks/useIdle";
import { useInterval } from "@/hooks/useInterval";
import { useTranslations } from "next-intl";
import { FullScreen, useFullScreenHandle } from "react-full-screen";

const Page = () => {
  const INTERVAL = 10 * 1000;
  const IMAGE_PAGE_SIZE = 5;
  const PREFETCH_THRESHOLD = 0;

  const router = useRouter();
  const t = useTranslations("common.slideshow");
  const isIdle = useIdle(2000);
  const fullScreenHandle = useFullScreenHandle();

  const [showQRCode, setShowQRCode] = useState<boolean>(true);

  const { id } = useParams<{ id: string }>();
  const { data } = useEventsQuery(id ? { id: [id] } : undefined);
  const eventData = data?.pages[0]?.items[0];

  const { data: joinCode } = useEventCodeQuery(id, "guest");

  const {
    data: imagePages,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useImagesQuery(id, { approval: "pending", pageSize: IMAGE_PAGE_SIZE });
  const imageData = imagePages?.pages.flatMap(page => page.items) ?? [];
  const [viewIndex, setViewIndex, { paused, toggle }] = useInterval(
    imageData.length,
    INTERVAL
  );
  const normalizedViewIndex =
    imageData.length > 0
      ? ((viewIndex % imageData.length) + imageData.length) % imageData.length
      : 0;
  const image = imageData[normalizedViewIndex];
  const prefetchedForLengthRef = useRef<number>(-1);

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage || imageData.length === 0) return;

    const remaining = imageData.length - (normalizedViewIndex + 1);
    if (remaining > PREFETCH_THRESHOLD) return;
    if (prefetchedForLengthRef.current === imageData.length) return;

    prefetchedForLengthRef.current = imageData.length;
    void fetchNextPage();
  }, [
    fetchNextPage,
    hasNextPage,
    imageData.length,
    isFetchingNextPage,
    normalizedViewIndex,
  ]);

  const [joinLink, setJoinLink] = useState<string | null>(null);
  useEffect(() => {
    (async () =>
      setJoinLink(new URL(`/join/${joinCode}`, window.location.origin).href))();
  }, [setJoinLink, joinCode]);

  const prevImage = () => setViewIndex(i => i - 1);
  const nextImage = () => setViewIndex(i => i + 1);

  return (
    <FullScreen handle={fullScreenHandle}>
      <div className={cl(styles.page, isIdle && styles.hideCursor)} data-testid="page">
        {!image && <p>{t("noApproved")}</p>}
        {image && (
          <Image
            fill
            src={`/api/events/${id}/images/${image.id}`}
            alt=""
            role="img"
            className={styles.image}
          />
        )}
        <div className={cl(styles.header, isIdle && styles.hidden)}>
          <X
            className={styles.back}
            onClick={() => router.back()}
            data-testid="back-button"
          />
          <Title
            size="xsmall"
            description={t("viewProgress", {
              index: Math.min(viewIndex + 1, imageData?.length ?? 0),
              total: imageData?.length ?? 0,
            })}
          >
            {eventData?.name}
          </Title>
        </div>
        <div
          className={cl(styles.buttonArray, isIdle && styles.hidden)}
          data-testid="controls"
        >
          <button onClick={prevImage}>
            <ChevronLeft />
          </button>
          <button onClick={toggle} data-testid="toggle-button">
            {paused ? <Play data-testid="play" /> : <Pause data-testid="pause" />}
          </button>
          <button onClick={nextImage}>
            <ChevronRight />
          </button>
          <button onClick={() => setShowQRCode(v => !v)} data-testid="qr-button">
            <QrCode />
          </button>
          <button
            onClick={() =>
              fullScreenHandle.active ? fullScreenHandle.exit() : fullScreenHandle.enter()
            }
            data-testid="fullscreen-button"
          >
            {fullScreenHandle.active ? <Shrink /> : <Expand />}
          </button>
        </div>
        {showQRCode && joinLink && (
          <QRDisplay value={joinLink} code={joinCode} className={styles.qrCode} />
        )}
      </div>
    </FullScreen>
  );
};

export default Page;
