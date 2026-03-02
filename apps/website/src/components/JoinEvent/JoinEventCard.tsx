"use client";
import { useState, SubmitEvent } from "react";
import { TextAlignStart } from "lucide-react";
import { Card, Input, Button, Title, DropdownControl } from "ui";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import styles from "./JoinEventCard.module.css";
import { QrCode } from "lucide-react";
import { useEventsQuery } from "@/hooks/useEvents";

const JoinEventCard = () => {
  const t = useTranslations("JoinEvent");
  const router = useRouter();
  const [code, setCode] = useState<string>("");
  const [error, setError] = useState<string | undefined>("");
  const [nickname, setNickname] = useState<string>("");

  const { refetch, isFetching } = useEventsQuery({ guestCode: code }, false);

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!nickname.trim()) {
      setError(t("error.invalidNickname"));
      return;
    }
    if (!code.trim()) {
      setError(t("error.noCode"));
      return;
    }

    const { data, isError, error } = await refetch();

    if (isError) {
      setError(error.message);
      return;
    }
    if (!data?.[0]) {
      setError(t("error.invalidCode"));
      return;
    }

    setError(undefined);
    router.push(`/${data[0]?.id}`);
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
                label={t("nicknameLabel")}
                placeholder={t("nicknamePlaceholder")}
                icon={<TextAlignStart size={24} />}
                aria-label={t("nicknameLabel")}
                value={nickname}
                onChange={e => setNickname(e.target.value)}
                error={error}
              />
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
                loading={isFetching}
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
    </Card>
  );
};

export default JoinEventCard;
