"use client";
import { TextAlignStart } from "lucide-react";
import { Card, Input, Button, Title, DropdownControl } from "ui";
import { useTranslations } from "next-intl";
import styles from "./JoinEventCard.module.css";
import { QrCode } from "lucide-react";
import Link from "next/link";
import { useCallback, SubmitEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { makeRequest } from "@/lib/utils/api";
import { getEventCodeSchema } from "@/db";

const JoinEventCard = () => {
  const router = useRouter();
  const t = useTranslations("JoinEvent");
  const [error, setError] = useState<string>("");

  const handleSubmit = useCallback(
    async (e: SubmitEvent<HTMLFormElement>) => {
      e.preventDefault();
      const code = new FormData(e.currentTarget).get("eventCode");
      if (typeof code !== "string") return;

      await makeRequest(getEventCodeSchema, `/api/events/by-code/${code}`)
        .then(() => router.push(`/join/${code}`))
        .catch(setError);
    },
    [router]
  );

  return (
    <Card>
      <Title size="medium" align="center" description={t("description")} as="h2">
        {t("title")}
      </Title>
      <DropdownControl className={styles.dropdownControls} defaultValue="enter-code">
        <DropdownControl.Item
          value="enter-code"
          label={t("enterCodeTab")}
          content={
            <form className={styles.content} onSubmit={handleSubmit}>
              <Input
                label={t("eventCodeLabel")}
                placeholder={t("eventCodePlaceholder")}
                icon={<TextAlignStart />}
                aria-label={t("eventCodeLabel")}
                name="eventCode"
                type="text"
                onKeyDown={() => setError("")}
                error={error}
                required
              />
              <Button
                className={styles.fullWidthButton}
                data-color="brand-purple"
                type="submit"
                fill
              >
                {t("joinButton")}
              </Button>
            </form>
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
                fill
              >
                {t("openCameraButton")}
              </Button>
            </div>
          }
        />
      </DropdownControl>
      <span>
        {t("linkToAdmin")}{" "}
        <Link role="link" href={"/admin"}>
          {t("admin")}
        </Link>
        .
      </span>
    </Card>
  );
};

export default JoinEventCard;
