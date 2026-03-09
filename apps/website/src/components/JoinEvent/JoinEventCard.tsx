"use client";
import { TextAlignStart } from "lucide-react";
import { Card, Input, Button, Title, DropdownControl } from "ui";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEventsQuery } from "@/hooks/useEvents";
import styles from "./JoinEventCard.module.css";
import { QrCode } from "lucide-react";
import Link from "next/link";
import { useState, SubmitEvent } from "react";

const JoinEventCard = () => {
  const t = useTranslations("JoinEvent");
  const router = useRouter();
  const [code, setCode] = useState<string>("");
  const [error, setError] = useState<string | undefined>("");
  const trimmedCode = code.trim();
  const { refetch, isFetching } = useEventsQuery(
    trimmedCode ? { id: [trimmedCode] } : undefined,
    false
  );

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!trimmedCode) {
      setError(t("error.noCode"));
      return;
    }

    setError(undefined);

    const { data, error: requestError } = await refetch();
    const event = data?.[0];
    if (requestError || !event) {
      setError(t("error.invalidCode"));
      return;
    }

    if (event.startDate.getTime() > Date.now()) {
      setError(t("error.futureEvent"));
      return;
    }

    router.push(`/${trimmedCode}/nickname`);
  };

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
                value={code}
                onChange={e => {
                  setCode(e.target.value);
                  setError(undefined);
                }}
                error={error}
              />
              <Button
                className={styles.fullWidthButton}
                data-color="brand-purple"
                type="submit"
                disabled={isFetching}
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
