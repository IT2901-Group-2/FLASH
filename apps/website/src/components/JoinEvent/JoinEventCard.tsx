"use client";
import { TextAlignStart } from "lucide-react";
import { Card, Input, Button, Title, DropdownControl } from "ui";
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
              />
              <Button className={styles.fullWidthButton} data-color="brand-purple">
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
