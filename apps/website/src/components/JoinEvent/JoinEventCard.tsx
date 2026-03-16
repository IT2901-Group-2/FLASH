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
import { IDetectedBarcode } from "@yudiel/react-qr-scanner";
import QrScanner from "../QRScanner/QRScanner";

const JoinEventCard = () => {
  const router = useRouter();
  const t = useTranslations("guest.login.card");
  const c = useTranslations("common");
  const tPage = useTranslations("pages.joinEvent");
  const [error, setError] = useState<string>("");
  const [scanning, setScanning] = useState<boolean>(false);

  const handleSubmit = useCallback(
    async (e: SubmitEvent<HTMLFormElement>) => {
      e.preventDefault();
      const code = new FormData(e.currentTarget).get("eventCode");
      if (typeof code !== "string") return;

      await makeRequest(getEventCodeSchema, `/api/events/by-code/${code}`)
        .then(() => router.push(`/join/${code}`))
        .catch(() => setError(t("errors.invalidEventCode")));
    },
    [router, t]
  );

  const handleScan = (values: IDetectedBarcode[]) => {
    values
      .filter(v => v.format === "qr_code")
      .map(v => v.rawValue)
      .forEach(url => {
        if (!url.startsWith(window.location.origin)) setError(t("errors.invalidQr"));
        else router.push(url.replace(window.location.origin, ""));
      });
  };

  return (
    <Card>
      <Title size="medium" align="center" description={tPage("description")} as="h2">
        {tPage("title")}
      </Title>
      <DropdownControl
        className={styles.dropdownControls}
        defaultValue="enter-code"
        onChange={() => {
          setError("");
          setScanning(false);
        }}
      >
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
              {scanning ? (
                <>
                  <QrScanner onScan={handleScan} />
                  <p className={styles.error}>{error}</p>
                </>
              ) : (
                <>
                  <div className={styles.qrContainer}>
                    <QrCode size={64} />
                  </div>
                  <p className={styles.qrText}>{t("scanQr.description")}</p>
                </>
              )}
              <Button
                className={styles.fullWidthButton}
                variant="secondary"
                data-color="brand-purple"
                fill
                onClick={() => setScanning(v => !v)}
              >
                {c("actions.toggleCamera", { open: String(scanning) })}
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
