import { Title, QRDisplay, Button, Input, Loader, DropdownControl } from "ui";
import { useRef, useState } from "react";
import { Copy, Download } from "lucide-react";
import styles from "./Steps.module.css";
import { useTranslations } from "next-intl";
import { downloadQrSvg } from "@/utils/downloadqrcode";
import { ReviewStepProps } from "./types";
import { useEventCodeQuery } from "@/hooks/useEvents";

const ReviewStep = ({ status, result }: ReviewStepProps) => {
  const t = useTranslations("admin.dashboard.event.create.review");
  const [shareRole, setShareRole] = useState<string>("guest");
  const qrContainerRef = useRef<HTMLDivElement | null>(null);
  const { data: displayCode } = useEventCodeQuery(
    result?.id,
    shareRole as "guest" | "moderator"
  );

  const displayLink = displayCode ? `${window.location.origin}/join/${displayCode}` : "";

  /**
   * Function to handle downloading the QR code as an SVG file.
   * It queries the QR code SVG element from the DOM and uses a utility function to trigger the download with
   * a filename based on the display code.
   *
   */
  const handleDownloadQR = () => {
    const svg = qrContainerRef.current?.querySelector("svg");
    if (svg && displayCode) downloadQrSvg(svg, `qr-${displayCode.toLowerCase()}.svg`);
  };

  if (status === "pending") return <Loader />;

  return (
    <>
      <Title size="medium" description={t("description")}>
        {t("title")}
      </Title>
      <DropdownControl
        onChange={setShareRole}
        value={shareRole}
        className={styles.scroll}
      >
        <DropdownControl.Item
          label={t("guest.name")}
          value="guest"
          content={
            <div className={styles.infoContainer}>
              <div className={styles.QRCodeContainer} ref={qrContainerRef}>
                <QRDisplay value={displayLink} code={displayCode} />
                <Button
                  variant="secondary"
                  icon={<Download />}
                  onClick={handleDownloadQR}
                >
                  {t("download")}
                </Button>
              </div>
              <div className={styles.linkContainer} data-color="neutral">
                <Title size="medium" description={t("guest.linkDescription")}>
                  {t("guest.linkTitle")}
                </Title>
                <Input
                  aria-label="link"
                  readOnly
                  value={displayLink}
                  icon={<Copy />}
                  iconPosition="right"
                  fill
                />
              </div>
            </div>
          }
        />
        <DropdownControl.Item
          label={t("moderator.name")}
          value="moderator"
          content={
            <div className={styles.infoContainer}>
              <div className={styles.QRCodeContainer} ref={qrContainerRef}>
                <QRDisplay value={displayLink} code={displayCode} />
                <Button
                  variant="secondary"
                  icon={<Download />}
                  onClick={handleDownloadQR}
                >
                  {t("download")}
                </Button>
              </div>
              <div className={styles.linkContainer} data-color="neutral">
                <Title size="medium" description={t("moderator.linkDescription")}>
                  {t("moderator.linkTitle")}
                </Title>
                <Input
                  aria-label="link"
                  readOnly
                  value={displayLink}
                  icon={<Copy />}
                  iconPosition="right"
                  fill
                />
              </div>
            </div>
          }
        />
      </DropdownControl>
    </>
  );
};

export default ReviewStep;
