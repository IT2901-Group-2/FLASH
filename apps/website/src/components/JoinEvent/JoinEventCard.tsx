"use client";
import { TextAlignStart } from "lucide-react";
import { Card, Input, Button, Title, DropdownControl } from "@flash/ui";
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
  const t = useTranslations("guest.login.card");
  const c = useTranslations("common");
  const tPage = useTranslations("pages.joinEvent");
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
      <Title size="medium" align="center" description={tPage("description")} as="h2">
        {tPage("title")}
      </Title>
      <DropdownControl className={styles.dropdownControls} defaultValue="enter-code">
        <DropdownControl.Item
          value="enter-code"
          label={t("tabs.enterCode")}
          content={
            <form className={styles.content} onSubmit={handleSubmit}>
              <Input
                label={c("fields.eventCode")}
                placeholder={t("fields.eventCode.placeholder")}
                icon={<TextAlignStart />}
                aria-label={c("fields.eventCode")}
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
                {c("actions.join")}
              </Button>
            </form>
          }
        />
        <DropdownControl.Item
          value="scan-qr"
          label={t("tabs.scanQr")}
          content={
            <div className={styles.content}>
              <div className={styles.qrContainer}>
                <QrCode size={64} />
              </div>
              <p className={styles.qrText}>{t("scanQr.description")}</p>
              <Button
                className={styles.fullWidthButton}
                variant="secondary"
                data-color="brand-purple"
                fill
              >
                {c("actions.openCamera")}
              </Button>
            </div>
          }
        />
      </DropdownControl>
      <span>
        {t("links.adminAccessPrefix")}{" "}
        <Link role="link" href={"/admin"}>
          {c("roles.admin")}
        </Link>
        .
      </span>
    </Card>
  );
};

export default JoinEventCard;
