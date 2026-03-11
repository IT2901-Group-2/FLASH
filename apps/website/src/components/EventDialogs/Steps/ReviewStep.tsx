import { Title, QRDisplay, Button, Input, Loader, DropdownControl } from "ui";
import { useEffect, useRef, useState } from "react";
import { Check, Copy, Download } from "lucide-react";
import styles from "./Steps.module.css";
import { useTranslations } from "next-intl";
import { downloadQrSvg } from "@/utils/downloadqrcode";
import { ReviewStepProps } from "./types";
import { useEventCodeQuery } from "@/hooks/useEvents";

const ReviewStep = ({ status, result }: ReviewStepProps) => {
  const tReview = useTranslations("admin.dashboard.event.create.review");
  const tShare = useTranslations("guest.event.share.links");
  const tShareAria = useTranslations("guest.event.share.aria");
  const tCommon = useTranslations("common");
  const [shareRole, setShareRole] = useState<"guest" | "moderator">("guest");
  const [copied, setCopied] = useState<"guest" | "moderator" | null>(null);
  const [copyError, setCopyError] = useState<"guest" | "moderator" | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const qrContainerRef = useRef<HTMLDivElement | null>(null);
  const { data: displayCode } = useEventCodeQuery(
    result?.id,
    shareRole as "guest" | "moderator"
  );

  const displayLink = displayCode ? `${window.location.origin}/join/${displayCode}` : "";

  // Clear the timeout on unmount to avoid having state on an unmounted component
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  /**
   * Reset role-scoped UI state when the active tab changes
   * This makes it so that switching between guest/moderator tabs resets the copied state
   */
  useEffect(() => {
    setCopied(null);
    setCopyError(null);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, [shareRole]);

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

  /**
   * Function to handle copying the share link to the clipboard. It attempts to write the display link to the clipboard
   * and provides user feedback on success or failure. If the copy action is successful, it sets a "copied" state to true
   * for a brief period to indicate success. If it fails, it sets an error message in the state.
   */
  const handleCopy = async () => {
    setCopyError(null);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (!displayLink) {
      setCopied(null);
      setCopyError(shareRole);
      return;
    }

    try {
      await navigator.clipboard.writeText(displayLink);
      setCopied(shareRole);
      timeoutRef.current = setTimeout(() => setCopied(null), 1200);
    } catch {
      setCopied(null);
      setCopyError(shareRole);
    }
  };

  /**
   * Render the copy/check button for a given role
   */
  const renderCopyButton = (role: "guest" | "moderator") => {
    const isCopied = copied === role;
    return (
      <button
        type="button"
        onClick={isCopied ? undefined : handleCopy}
        disabled={isCopied}
        aria-label="Copy share link"
        style={{ cursor: isCopied ? "default" : "pointer", background: "none", border: "none", padding: 0, display: "flex", alignItems: "center" }}
      >
        {isCopied ? <Check size={18} /> : <Copy size={18} />}
      </button>
    );
  };

  if (status === "pending") return <Loader />;

  return (
    <>
      <Title size="medium" description={tReview("description")}>
        {tReview("title")}
      </Title>
      <DropdownControl
        onChange={(role) => setShareRole(role as "guest" | "moderator")}
        value={shareRole}
        className={styles.scroll}
      >
        <DropdownControl.Item
          label={tCommon("roles.guest")}
          value="guest"
          content={
            <div className={styles.infoContainer}>
              <div className={styles.QRCodeContainer} ref={qrContainerRef}>
                <QRDisplay
                  value={displayLink}
                  code={displayCode}
                  helperText={tCommon("messages.scanToUploadPhotos")}
                />
                <Button
                  variant="secondary"
                  icon={<Download />}
                  onClick={handleDownloadQR}
                >
                  {tCommon("actions.download")}
                </Button>
              </div>
              <div className={styles.linkContainer} data-color="neutral">
                <Title size="medium" description={tShare("guest.description")}>
                  {tShare("guest.title")}
                </Title>
                <Input
                  aria-label={tShareAria("guestLinkInput")}
                  readOnly
                  value={displayLink}
                  icon={renderCopyButton("guest")}
                  iconPosition="right"
                  fill
                />
                {copyError ? <p className={styles.copyError}>{copyError}</p> : null}
              </div>
            </div>
          }
        />
        <DropdownControl.Item
          label={tCommon("roles.moderator")}
          value="moderator"
          content={
            <div className={styles.infoContainer}>
              <div className={styles.QRCodeContainer} ref={qrContainerRef}>
                <QRDisplay
                  value={displayLink}
                  code={displayCode}
                  helperText={tCommon("messages.scanToUploadPhotos")}
                />
                <Button
                  variant="secondary"
                  icon={<Download />}
                  onClick={handleDownloadQR}
                >
                  {tCommon("actions.download")}
                </Button>
              </div>
              <div className={styles.linkContainer} data-color="neutral">
                <Title size="medium" description={tShare("moderator.description")}>
                  {tShare("moderator.title")}
                </Title>
                <Input
                  aria-label={tShareAria("moderatorLinkInput")}
                  readOnly
                  value={displayLink}
                  icon={renderCopyButton("moderator")}
                  iconPosition="right"
                  fill
                />
                {copyError ? <p className={styles.copyError}>{copyError}</p> : null}
              </div>
            </div>
          }
        />
      </DropdownControl>
    </>
  );
};

export default ReviewStep;
