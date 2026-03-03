import { useCallback, useRef, useState } from "react";
import { StepProps } from "../CreateEventCard";
import { Title, SegmentedControl, QRDisplay, Button, Input, Loader } from "ui";
import { Copy, Download } from "lucide-react";
import styles from "./Steps.module.css";
import { useTranslations } from "next-intl";
import { downloadQrSvg } from "@/utils/downloadqrcode";
import { useEventCodeQuery } from "@/hooks/useEvents";

const ReviewStep = ({
  status,
  result,
}: Omit<StepProps, "formData" | "updateFormData">) => {
  const t = useTranslations("admin.dashboard.event.create.review");
  const [shareRole, setShareRole] = useState<"guest" | "moderator">("guest");
  const qrContainerRef = useRef<HTMLDivElement | null>(null);
  const { data: displayCode } = useEventCodeQuery(result?.id, shareRole);

  const displayLink = displayCode ? `${window.location.origin}/event/${displayCode}` : "";

  if (status === "pending") return <Loader />;

  /**
   * Function to handle downloading the QR code as an SVG file.
   * It queries the QR code SVG element from the DOM and uses a utility function to trigger the download with
   * a filename based on the display code.
   *
   */
  const handleDownloadQR = () => {
    const svg = qrContainerRef.current?.querySelector("svg");
    if (svg && displayCode) {
      downloadQrSvg(svg, `qr-${displayCode.toLowerCase()}.svg`);
    }
  };

  const handleRoleChange = useCallback(
    (role: string) => {
      if (role !== "guest" && role !== "moderator") {
        return;
      }

      setShareRole(role);
    },
    [setShareRole]
  );

  return (
    <>
      <Title size="medium" description={t("description")}>
        {t("title")}
      </Title>
      <SegmentedControl onChange={handleRoleChange} value={shareRole} fill>
        <SegmentedControl.Item label={t("guest.name")} value="guest" />
        <SegmentedControl.Item label={t("moderator.name")} value="moderator" />
      </SegmentedControl>
      <div className={styles.infoContainer}>
        <div className={styles.QRCodeContainer} ref={qrContainerRef}>
          <QRDisplay value={displayLink} code={displayCode} />
          <Button variant="secondary" icon={<Download />} onClick={handleDownloadQR}>
            {t("download")}
          </Button>
        </div>
        <div className={styles.linkContainer}>
          <Title size="medium" description={t("guest.linkDescription")}>
            {t("guest.linkTitle")}
          </Title>
          <Input
            aria-label="link"
            readOnly
            value={displayLink}
            icon={<Copy />}
            iconPosition="right"
          />
        </div>
      </div>
    </>
  );
};

export default ReviewStep;
