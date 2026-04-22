"use client";

import { useEventCodeQuery, useEventsQuery, useEventStatsQuery } from "@/hooks/useEvents";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, QRDisplay, Title } from "@flash/ui";
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
import { SLIDE_DURATION } from "@/config";

const Page = () => {
  const router = useRouter();
  const t = useTranslations("common.slideshow");
  const isIdle = useIdle(2000);
  const fullScreen = useFullScreenHandle();

  const [showQRCode, setShowQRCode] = useState<boolean>(true);

  const { id } = useParams<{ id: string }>();
  const { data } = useEventsQuery(id ? { id: [id] } : undefined);
  const eventData = data?.[0];

  const { data: joinCode } = useEventCodeQuery(id, "guest");
  const { data: imageStats } = useEventStatsQuery(id);

  const { data: imageData } = useImagesQuery(id, { approval: "pending" }, SLIDE_DURATION);
  const [viewIndex, setViewIndex, { paused, toggle }] = useInterval(
    imageData?.length ?? 0,
    SLIDE_DURATION
  );
  const image = imageData?.[viewIndex];

  const [joinLink, setJoinLink] = useState<string | null>(null);
  useEffect(() => {
    (async () =>
      setJoinLink(new URL(`/join/${joinCode}`, window.location.origin).href))();
  }, [setJoinLink, joinCode]);

  const prevImage = () => setViewIndex(i => i - 1);
  const nextImage = () => setViewIndex(i => i + 1);

  return (
    <FullScreen handle={fullScreen}>
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
              total: imageStats?.pendingImages ?? 0,
            })}
          >
            {eventData?.name}
          </Title>
        </div>
        <div
          className={cl(styles.buttonArray, isIdle && styles.hidden)}
          data-testid="controls"
        >
          <Button variant="icon" onClick={prevImage}>
            <ChevronLeft />
          </Button>
          <Button variant="icon" onClick={toggle} data-testid="toggle-button">
            {paused ? <Play data-testid="play" /> : <Pause data-testid="pause" />}
          </Button>
          <Button variant="icon" onClick={nextImage}>
            <ChevronRight />
          </Button>
          <Button
            variant="icon"
            onClick={() => setShowQRCode(v => !v)}
            data-testid="qr-button"
          >
            <QrCode />
          </Button>
          <Button
            variant="icon"
            onClick={fullScreen.active ? fullScreen.exit : fullScreen.enter}
            data-testid="fullscreen-button"
          >
            {fullScreen.active ? <Shrink /> : <Expand />}
          </Button>
        </div>
        {showQRCode && joinLink && (
          <QRDisplay value={joinLink} code={joinCode} className={styles.qrCode} />
        )}
      </div>
    </FullScreen>
  );
};

export default Page;
