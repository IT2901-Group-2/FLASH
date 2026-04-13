"use client";

import { useEventCodeQuery, useEventsQuery } from "@/hooks/useEvents";
import { ArrowLeft, ArrowRight, Share, Play } from "lucide-react";
import { useParams } from "next/navigation";
import { Button, Card, Dialog, Title } from "@flash/ui";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import { ReviewStep } from "@/components/EventDialogs/Steps";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import { getAdminDashboardEventsRoute } from "@/lib/routes";

const Page = () => {
  const qrCodeRef = useRef<HTMLDialogElement>(null);
  const navigation = useRouter();
  const c = useTranslations("common.actions");

  const { id, locale } = useParams<{ id: string; locale: string }>();
  const { data: joinCode } = useEventCodeQuery(id, "moderator");
  const { data = [], status } = useEventsQuery({ id: [id?.toString() || ""] });
  const eventData = data[0];
  if (!eventData) return;

  return (
    <>
      <Dialog ref={qrCodeRef} closedby="any" style={{ overflowY: "scroll" }}>
        <ReviewStep result={eventData} status={status} />
        <Button
          variant="secondary"
          data-color="neutral"
          className={styles.dialogCloseButton}
          onClick={() => qrCodeRef.current?.close()}
        >
          {c("close")}
        </Button>
      </Dialog>

      <div className={styles.header}>
        <div className={styles.headerItem}>
          <ArrowLeft
            className={styles.back}
            onClick={() => navigation.push(getAdminDashboardEventsRoute())}
          />
          <Title description={eventData?.description}>{eventData?.name}</Title>
        </div>
        <Card className={styles.card}>
          <Button
            data-color="brand-purple"
            icon={<Share />}
            variant="secondary"
            onClick={() => qrCodeRef.current?.showModal()}
          >
            {c("shareEvent")}
          </Button>
          <Button
            data-color="brand-purple"
            icon={<Play />}
            onClick={() => navigation.push(`/events/${id}/slideshow`)}
          >
            {c("slideshow")}
          </Button>
          <Button
            data-color="brand-purple"
            className={styles.goToEventButton}
            icon={<ArrowRight />}
            iconPosition="right"
            onClick={() => navigation.push(`/${locale}/join/${joinCode}`)}
          >
            {c("join")}
          </Button>
        </Card>
      </div>
    </>
  );
};

export default Page;
