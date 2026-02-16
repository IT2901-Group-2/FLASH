"use client";
import { TextAlignStart } from "lucide-react";
import { Card, Input, Button, Title, DropdownControls } from "ui";
import { useTranslations } from "next-intl";
import styles from "./JoinEventCard.module.css";
import { QrCode } from "lucide-react";

const JoinEventCard = () => {
  const t = useTranslations("JoinEvent");

  return (
    <Card data-color="background-secondary">
      <Title align="center" description={t("description")} as="h2">
        {t("title")}
      </Title>
      <DropdownControls
        className={styles.dropdownControls}
        defaultValue="enter-code"
        options={[
          {
            content: (
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
            ),
            label: t("enterCodeTab"),
            value: "enter-code",
          },
          {
            content: (
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
            ),
            label: t("scanQrTab"),
            value: "scan-qr",
          },
        ]}
      ></DropdownControls>
    </Card>
  );
};

export default JoinEventCard;
