"use client";
import { useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Copy, Check, CircleAlert, QrCode, Download } from "lucide-react";
import { Title, SegmentedControl, QRDisplay, TextField, ActionCard } from "ui";
import styles from "./ShareEvent.module.css";
import { useIsMounted } from "@/hooks/useIsMounted";
import { downloadQrSvg } from "@/utils/downloadqrcode";

type ShareOrigin = "create" | "share";

export default function Page() {
  const t = useTranslations("ShareEventPage");

  const [shareRole, setShareRole] = useState<string>("guest");

  const searchParams = useSearchParams();
  const origin: ShareOrigin = searchParams.get("from") === "share" ? "share" : "create";

  const mounted = useIsMounted(); // For avoiding hydration error caused by window.location usage on initial render. Open for alternative solutions

  const eventId = "abc123"; // TODO: Replace with actual event ID
  const sharePath = `/event/${eventId}/${shareRole}`;
  const shareUrl = mounted ? `${window.location.origin}${sharePath}` : sharePath;
  const displayCode = `${eventId.toUpperCase()}-${shareRole.substring(0, 1).toUpperCase()}`;

  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState<string | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const qrContainerRef = useRef<HTMLDivElement | null>(null);

  const originDependentContent =
    origin === "create"
      ? {
          firstTitle: t("create.firstTitle"),
          firstDescription: t("create.firstDescription"),
          doneText: t("create.doneText"),
        }
      : {
          firstTitle: t("share.firstTitle"),
          firstDescription: t("share.firstDescription"),
          doneText: t("share.doneText"),
        };

  const linkContent =
    shareRole === "guest"
      ? {
          title: t("links.guest.title"),
          description: t("links.guest.description"),
        }
      : {
          title: t("links.moderator.title"),
          description: t("links.moderator.description"),
        };

  const handleCopy = async () => {
    setCopyError(null);
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);

    try {
      const absoluteShareUrl = `${window.location.origin}${sharePath}`;
      await navigator.clipboard.writeText(absoluteShareUrl);
      setCopied(true);
      timeoutRef.current = window.setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
      setCopyError(t("errors.copyFailed"));
    }
  };

  const handleDownloadQR = () => {
    const svg = qrContainerRef.current?.querySelector("svg");
    if (svg) {
      downloadQrSvg(svg, `qr-${displayCode.toLowerCase()}.svg`);
    }
  };

  const handleDone = () => {
    if (origin === "create") {
      // TODO: route to post-create destination
    }
    // TODO: route back to "Event Overview" page
  };

  return (
    <div className={styles.pageWrapper}>
      <Title
        align="left"
        size="medium"
        as="h2"
        data-color="brand-purple"
        description={originDependentContent.firstDescription}
      >
        {originDependentContent.firstTitle}
      </Title>

      <div style={{ alignSelf: "center" }}>
        <SegmentedControl
          fill
          value={shareRole}
          onChange={setShareRole}
          data-color="accent"
        >
          <SegmentedControl.Item value="guest" label={t("controls.guest")} />
          <SegmentedControl.Item value="moderator" label={t("controls.moderator")} />
        </SegmentedControl>
      </div>

      <div
        ref={qrContainerRef}
        style={{ alignSelf: "center", margin: "0.5rem 0 0.25rem" }}
      >
        <QRDisplay value={shareUrl} code={displayCode} />
      </div>

      <Title
        align="left"
        size="medium"
        as="h2"
        data-color="brand-purple"
        description={linkContent.description}
      >
        <span style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem" }}>
          {linkContent.title}
          {shareRole === "moderator" && (
            <CircleAlert
              size={18}
              aria-label={t("aria.moderatorAlert")}
              style={{ color: "var(--color-warning-600)" }}
            />
          )}
        </span>
      </Title>

      <div style={{ alignSelf: "center", width: "100%", maxWidth: "21.375rem" }}>
        <TextField
          aria-label={
            shareRole === "guest"
              ? t("aria.guestLinkInput")
              : t("aria.moderatorLinkInput")
          }
          value={shareUrl}
          readOnly
          visualSize="large"
          data-color="accent"
          icon={
            copied ? (
              <Check
                size={18}
                aria-label={t("aria.copied")}
                style={{ cursor: "pointer" }}
              />
            ) : (
              <Copy
                size={18}
                aria-label={t("aria.copyLink")}
                style={{ cursor: "pointer" }}
                onClick={handleCopy}
              />
            )
          }
          iconPosition="right"
        />
        {copyError ? <p className={styles.copyError}>{copyError}</p> : null}
      </div>

      <div className={styles.actionCardDock}>
        <div className={styles.actionCardInner}>
          <ActionCard
            style={{ padding: "1rem", borderRadius: "1.25rem" }}
            secondaryButton={{
              text: (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.375rem",
                  }}
                >
                  {t("actions.downloadQr")}
                  <Download size={18} />
                </span>
              ),
              size: "small",
              icon: <QrCode size={18} />,
              iconPosition: "left",
              onClick: handleDownloadQR,
              "data-color": "brand-purple",
            }}
            primaryButton={{
              text: originDependentContent.doneText,
              size: "small",
              onClick: handleDone,
              "data-color": "brand-purple",
            }}
          />
        </div>
      </div>
    </div>
  );
}
