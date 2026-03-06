"use client";

import { useEventsQuery } from "@/hooks/useEvents";
import { ArrowLeft, ArrowRight, Download, Play } from "lucide-react";
import { useParams } from "next/navigation";
import { Button, Dialog, Title } from "ui";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import { ReviewStep } from "@/components/EventDialogs/Steps";
import { useRef } from "react";

const Page = () => {
  const qrCodeRef = useRef<HTMLDialogElement>(null);
  const navigation = useRouter();

  const { id } = useParams();
  const { data, status } = useEventsQuery({ id: [id?.toString() || ""] });
  if (data === undefined) return;
  const eventData = data[0];

  return (
    <>
      <Dialog ref={qrCodeRef}>
        <ReviewStep result={eventData} status={status} />
        <Button
          variant="secondary"
          data-color="neutral"
          className={styles.dialogCloseButton}
          onClick={() => qrCodeRef.current?.close()}
        >
          Close
        </Button>
      </Dialog>

      <Button
        data-color="brand-purple"
        className={styles.goToEventButton}
        icon={<ArrowRight />}
        iconPosition="right"
        onClick={() => navigation.push(`/${id}`)}
      >
        Open Event
      </Button>
      <div className={styles.header}>
        <div className={styles.headerItem}>
          <ArrowLeft className={styles.back} onClick={navigation.back} />
          <Title description={eventData?.description}>{eventData?.name}</Title>
        </div>
        <div className={styles.header}>
          <Button
            data-color="brand-purple"
            icon={<Download />}
            variant="secondary"
            onClick={() => qrCodeRef.current?.showModal()}
          >
            QR Code
          </Button>
          <Button data-color="brand-purple" icon={<Play />}>
            Slideshow
          </Button>
        </div>
      </div>
    </>
  );
};

export default Page;
