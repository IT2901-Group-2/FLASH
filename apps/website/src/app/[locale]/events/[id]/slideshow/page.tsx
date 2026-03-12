"use client";

import { useEventCodeQuery, useEventsQuery } from "@/hooks/useEvents";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { QRDisplay, Title } from "ui";
import styles from "./slideshow.module.css";
import { ChevronLeft, ChevronRight, QrCode, X } from "lucide-react";
import { cl } from "@/utils/className";

const Page = () => {
  const router = useRouter();
  const [isIdle, setIsIdle] = useState<boolean>(false);
  const [showQRCode, setShowQRCode] = useState<boolean>(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const { id } = useParams<{ id: string }>();

  const { data } = useEventsQuery(id ? { id: [id] } : undefined);
  const eventData = data?.[0];

  const { data: joinCode } = useEventCodeQuery(id, "guest");

  const [joinLink, setJoinLink] = useState<string | null>(null);
  useEffect(() => {
    (async () =>
      setJoinLink(new URL(`/join/${joinCode}`, window.location.origin).href))();
  }, [setJoinLink, joinCode]);

  useEffect(() => {
    const resetTimer = () => {
      setIsIdle(false);
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setIsIdle(true), 2000);
    };

    const events = ["mousemove", "mousedown", "keydown"];
    events.forEach(e => window.addEventListener(e, resetTimer));
    resetTimer();

    return () => {
      clearTimeout(timerRef.current);
      events.forEach(e => window.removeEventListener(e, resetTimer));
    };
  }, []);

  return (
    <div className={cl(styles.page, isIdle && styles.hideCursor)}>
      <div className={cl(styles.header, isIdle && styles.hidden)}>
        <X className={styles.back} onClick={() => navigation.back()} />
        <Title size="xsmall" description={"1 of 4"}>
          {eventData?.name}
        </Title>
      </div>
      <button
        onClick={() => setShowQRCode(v => !v)}
        className={cl(styles.button, styles.qrCodeSwitch, isIdle && styles.hidden)}
      >
        <QrCode />
      </button>
      <button className={cl(styles.button, styles.prev, isIdle && styles.hidden)}>
        <ChevronLeft />
      </button>
      <button className={cl(styles.button, styles.next, isIdle && styles.hidden)}>
        <ChevronRight />
      </button>
      {showQRCode && joinLink && (
        <QRDisplay value={joinLink} code={joinCode} className={styles.qrCode} />
      )}
    </div>
  );
};

export default Page;
