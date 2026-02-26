"use client";
import { useEffect, useRef, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Copy, Check, CircleAlert, QrCode, Download } from "lucide-react";
import { Title, Controls, QRDisplay, Input, ActionCard } from "ui";
import styles from "./ShareEvent.module.css";
import { useIsMounted } from "@/hooks/useIsMounted";
import { useEventsQuery } from "@/hooks/useEvents";
import { downloadQrSvg } from "@/utils/downloadqrcode";
import { useCopyToClipboard } from "usehooks-ts";

type ShareOrigin = "create" | "share";

export default function Page() {
  const t = useTranslations("ShareEventPage");
  const router = useRouter();
  const searchParams = useSearchParams();

  const params = useParams<{ locale?: string; id?: string }>();
  const locale = typeof params.locale === "string" ? params.locale : "en";
  const eventId = typeof params.id === "string" ? params.id : "";

  const [shareRole, setShareRole] = useState<"guest" | "moderator">("guest");

  const qrContainerRef = useRef<HTMLDivElement>(null);

  const mounted = useIsMounted();

  const { data, isLoading, isError } = useEventsQuery(
    eventId ? { id: [eventId], archived: "all" } : undefined
  );
  const eventData = data?.[0];

  const origin: ShareOrigin = searchParams.get("from") === "share" ? "share" : "create";
  const returnToParam = searchParams.get("returnTo");
  const safeReturnTo =
    returnToParam && returnToParam.startsWith("/") ? returnToParam : undefined;

  const shareCode =
    shareRole === "guest" ? eventData?.guestCode : eventData?.moderatorCode;
  const codeParamName = shareRole === "guest" ? "guestCode" : "moderatorCode";

  const sharePath = eventId
    ? `/${locale}/${eventId}${
        shareCode ? `?${codeParamName}=${encodeURIComponent(shareCode)}` : ""
      }`
    : `/${locale}`;

  const shareUrl = mounted ? `${window.location.origin}${sharePath}` : sharePath;
  const displayCode = shareCode ?? "—";

  const [copiedText, copy] = useCopyToClipboard();
  const [showCopiedFeedback, setShowCopiedFeedback] = useState(false);
  const copied = showCopiedFeedback && copiedText === shareUrl;

  useEffect(() => {
    if (!showCopiedFeedback) return;

    const timeoutId = window.setTimeout(() => {
      setShowCopiedFeedback(false);
    }, 1500);

    return () => window.clearTimeout(timeoutId);
  }, [showCopiedFeedback]);

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

  const handleCopy = (text: string) => () => {
    copy(text)
      .then(() => {
        setShowCopiedFeedback(true);
        console.log(t("aria.copied"), { text });
      })
      .catch(error => {
        setShowCopiedFeedback(false);
        console.error(t("errors.copyFailed"), error);
      });
  };

  const handleDownloadQR = () => {
    const svg = qrContainerRef.current?.querySelector("svg");
    if (svg) {
      downloadQrSvg(svg, `qr-${displayCode.toLowerCase()}.svg`);
    }
  };

  const handleDone = () => {
    // TODO
    const fallbackReturn =
      origin === "create"
        ? `/${locale}/admin/dashboard/events`
        : eventId
          ? `/${locale}/admin/dashboard/events/${eventId}`
          : `/${locale}/admin/dashboard/events`;

    router.push(safeReturnTo ?? fallbackReturn);
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
        <Controls
          options={[
            { value: "guest", label: t("controls.guest") },
            { value: "moderator", label: t("controls.moderator") },
          ]}
          value={shareRole}
          onChange={setShareRole}
          variant="primary"
          data-color="accent"
        />
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
        <Input
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
              <span className={styles.copyIconWrap}>
                <Check
                  size={18}
                  aria-label={t("aria.copied")}
                  style={{ cursor: "default" }}
                />
                <span
                  className={styles.copySuccessPopup}
                  role="status"
                  aria-live="polite"
                >
                  {t("aria.copied")}
                </span>
              </span>
            ) : (
              <Copy
                size={18}
                aria-label={t("aria.copyLink")}
                style={{ cursor: "pointer" }}
                onClick={handleCopy(shareUrl)}
              />
            )
          }
          iconPosition="right"
        />
        {!isLoading && (isError || !eventData) ? (
          <p className={styles.copyError}>Could not load event share data.</p>
        ) : null}
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
              disabled: isLoading || isError || !eventData,
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
