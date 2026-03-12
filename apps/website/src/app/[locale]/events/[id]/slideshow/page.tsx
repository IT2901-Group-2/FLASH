"use client";

import { useEventCodeQuery, useEventsQuery } from "@/hooks/useEvents";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { QRDisplay, Title } from "ui";
import styles from "./slideshow.module.css";
import { ChevronLeft, ChevronRight, QrCode, X } from "lucide-react";
import { cl } from "@/utils/className";
import { useImagesQuery } from "@/hooks/useImages";
import Image from "next/image";
import { useIdle } from "@/hooks/useIdle";
import { useInterval } from "@/hooks/useInterval";

const Page = () => {
  const INTERVAL = 10 * 1000;

  const router = useRouter();
  const [showQRCode, setShowQRCode] = useState<boolean>(true);
  const isIdle = useIdle(2000);

  const { id } = useParams<{ id: string }>();

  const { data } = useEventsQuery(id ? { id: [id] } : undefined);
  const eventData = data?.[0];

  const { data: joinCode } = useEventCodeQuery(id, "guest");

  const { data: imageData } = useImagesQuery(id, { approval: "approved" }, INTERVAL);
  const [viewIndex, setViewIndex] = useInterval(imageData?.length ?? 0, INTERVAL);
  const image = imageData?.[viewIndex];

  const [joinLink, setJoinLink] = useState<string | null>(null);
  useEffect(() => {
    (async () =>
      setJoinLink(new URL(`/join/${joinCode}`, window.location.origin).href))();
  }, [setJoinLink, joinCode]);

  const prevImage = () => setViewIndex(i => i - 1);
  const nextImage = () => setViewIndex(i => i + 1);

  return (
    <div className={cl(styles.page, isIdle && styles.hideCursor)}>
      {!image && <p>No approved images.</p>}
      {image && (
        <Image
          fill
          src={`/api/events/${id}/images/${image.id}`}
          alt=""
          className={styles.image}
        />
      )}
      <div className={cl(styles.header, isIdle && styles.hidden)}>
        <X className={styles.back} onClick={() => router.back()} />
        <Title
          size="xsmall"
          description={`${Math.min(viewIndex + 1, imageData?.length ?? 0)} of ${imageData?.length}`}
        >
          {eventData?.name}
        </Title>
      </div>
      <button
        onClick={() => setShowQRCode(v => !v)}
        className={cl(styles.button, styles.qrCodeSwitch, isIdle && styles.hidden)}
      >
        <QrCode />
      </button>
      <button
        className={cl(styles.button, styles.prev, isIdle && styles.hidden)}
        onClick={prevImage}
      >
        <ChevronLeft />
      </button>
      <button
        className={cl(styles.button, styles.next, isIdle && styles.hidden)}
        onClick={nextImage}
      >
        <ChevronRight />
      </button>
      {showQRCode && joinLink && (
        <QRDisplay value={joinLink} code={joinCode} className={styles.qrCode} />
      )}
    </div>
  );
};

export default Page;
