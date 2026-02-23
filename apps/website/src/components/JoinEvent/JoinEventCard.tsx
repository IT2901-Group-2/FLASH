"use client";
import { useState } from "react";
import { TextAlignStart } from "lucide-react";
import { Card, Input, Button, Title, DropdownControl } from "ui";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import styles from "./JoinEventCard.module.css";
import { QrCode } from "lucide-react";
import type { EventDTO } from "@/types/eventTypes";

const JoinEventCard = () => {
  const t = useTranslations("JoinEvent");
  const router = useRouter();
  const { locale } = useParams<{ locale: string }>();
  const [eventCode, setEventCode] = useState("");
  const [joinError, setJoinError] = useState<string | null>(null);
  const [isJoining, setIsJoining] = useState(false);

  const handleJoin = async () => {
    const trimmedCode = eventCode.trim();

    if (!trimmedCode) {
      setJoinError("Please enter an event code.");
      return;
    }

    setIsJoining(true);
    setJoinError(null);

    try {
      const response = await fetch(
        `/api/events?guestCode=${encodeURIComponent(trimmedCode)}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch event");
      }

      const events = (await response.json()) as EventDTO[];
      const event = events[0];

      if (!event) {
        setJoinError("No event found for that code.");
        return;
      }

      router.push(`/${locale}/${event.id}`);
    } catch {
      setJoinError("Could not join event. Please try again.");
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <Card data-color="background-secondary">
      <Title align="center" description={t("description")} as="h2">
        {t("title")}
      </Title>
      <DropdownControl className={styles.dropdownControls} defaultValue="enter-code">
        <DropdownControl.Item
          value="enter-code"
          label={t("enterCodeTab")}
          content={
            <div className={styles.content}>
              <Input
                label={t("eventCodeLabel")}
                placeholder={t("eventCodePlaceholder")}
                icon={<TextAlignStart size={24} />}
                aria-label={t("eventCodeLabel")}
                value={eventCode}
                onChange={e => setEventCode(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    void handleJoin();
                  }
                }}
                error={joinError ?? undefined}
              />
              <Button
                className={styles.fullWidthButton}
                data-color="brand-purple"
                onClick={() => void handleJoin()}
                loading={isJoining}
              >
                {t("joinButton")}
              </Button>
            </div>
          }
        />
        <DropdownControl.Item
          value="scan-qr"
          label={t("scanQrTab")}
          content={
            <div className={styles.content}>
              <div className={styles.qrContainer}>
                <QrCode size={64} />
              </div>
              <p className={styles.qrText}>{t("scanQrDescription")}</p>
              <Button
                className={styles.fullWidthButton}
                variant="secondary"
                data-color="brand-purple"
              >
                {t("openCameraButton")}
              </Button>
            </div>
          }
        />
        <div className={styles.content}>
          <Input
            label={t("eventCodeLabel")}
            placeholder={t("eventCodePlaceholder")}
            icon={<TextAlignStart size={24} />}
            aria-label={t("eventCodeLabel")}
          />
          <Button className={styles.fullWidthButton} data-color="brand-purple">
            {t("joinButton")}
          </Button>
        </div>
      </DropdownControl>
    </Card>
  );
};

export default JoinEventCard;
