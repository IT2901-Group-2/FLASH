import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { User, Camera, Upload, QrCode } from "lucide-react";
import { cl } from "@/util/helpers/className";
import styles from "./PhoneHeader.module.css";
import { Button } from "../Button";
import QRDisplay from "../QRDisplay/QRDisplay";
import type { QRDisplayProps } from "../QRDisplay/QRDisplay";

const getResponsiveQrSize = (width: number): QRDisplayProps["size"] => {
  if (width >= 1200) {
    return "large";
  }

  if (width >= 768) {
    return "medium";
  }

  return "small";
};

export interface PhoneHeaderProps {
  /** The title to display in the phone header. */
  title: string;
  /** Optional subtitle shown beneath the title. */
  subtitle: string;
  /** Optional icon for the left action (back/menu). */
  leftIcon?: ReactNode;
  /** Accessible label for the left action button. */
  leftAriaLabel?: string;
  /** Click handler for the left action. */
  onLeftClick?: () => void;
  /** Text for the right action pill. */
  rightLabel?: string;
  /** Optional icon for the right action pill. */
  rightIcon?: ReactNode;
  /** Accessible label for the right action. */
  rightAriaLabel?: string;
  /** Click handler for the tertiary desktop action (left-most). */
  onTertiaryClick?: () => void;
  /** Click handler for the secondary desktop action (middle). */
  onSecondaryClick?: () => void;
  /** Click handler for the primary desktop action (right-most). */
  onPrimaryClick?: () => void;
  /** Label/text (or node) for the primary desktop action. Defaults to English 'Upload Image'. */
  primaryText?: ReactNode;
  /** Label/text (or node) for the secondary desktop action. Defaults to English 'Take Photo'. */
  secondaryText?: ReactNode;
  /** Label/text (or node) for the tertiary desktop action (left-most) if applicable. */
  tertiaryText?: ReactNode;
  /** Visual style for the right action pill. */
  rightVariant?: "primary" | "secondary" | "tertiary";
  /** Optional CSS class name for custom styling. */
  className?: string;
  /** Number of uploads remaining (shown on desktop only). */
  uploadsRemaining?: number;
  /** Optional value to encode in the QR code shown by the tertiary action. Defaults to current location if available. */
  qrValue?: string;
  /** Optional children rendered beneath the header (e.g., Breadcrumb). */
  children?: ReactNode;
}

/**
 * A phone header component that displays a title, optional subtitle, and optional
 * left/right actions suitable for mobile interfaces.
 *
 *  > _Last updated: `2026-02-11`_
 */
export const PhoneHeader = ({
  title,
  subtitle,
  leftIcon,
  leftAriaLabel = "Go back",
  onLeftClick,
  rightLabel,
  rightIcon,
  rightAriaLabel,
  onTertiaryClick,
  onSecondaryClick,
  onPrimaryClick,
  primaryText,
  secondaryText,
  tertiaryText,
  className,
  uploadsRemaining,
  qrValue,
  children,
}: PhoneHeaderProps) => {
  const handleLeftClick =
    onLeftClick ??
    (() => {
      if (
        typeof window !== "undefined" &&
        window.history &&
        typeof window.history.back === "function"
      ) {
        window.history.back();
      }
    });
  const [showQr, setShowQr] = useState(false);
  const [qrSize, setQrSize] = useState<QRDisplayProps["size"]>("medium");

  // Update QR size based on window width
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const updateQrSize = () => {
      setQrSize(getResponsiveQrSize(window.innerWidth));
    };

    updateQrSize();
    window.addEventListener("resize", updateQrSize);

    return () => {
      window.removeEventListener("resize", updateQrSize);
    };
  }, []);

  return (
    <header className={cl(styles.phoneheader, styles.container, className)}>
      <div className={styles.headerRow}>
        {leftIcon ? (
          <button
            type="button"
            className={cl(styles.leftAction, styles.leftActionButton)}
            onClick={handleLeftClick}
            aria-label={leftAriaLabel}
          >
            <span className={styles.iconWrapper}>{leftIcon}</span>
          </button>
        ) : (
          <span className={styles.leftSpacer} />
        )}

        <div className={styles.titleBlock}>
          <h1 className={styles.title}>{title}</h1>
          {subtitle ? (
            <div className={styles.subtitle}>
              <span className={styles.iconWrapper}>
                <User />
              </span>
              <span>{subtitle}</span>
            </div>
          ) : null}
          {uploadsRemaining !== undefined && (
            <div className={styles.uploadsInfo}>
              You have {uploadsRemaining} uploads remaining
            </div>
          )}
        </div>

        {/* Desktop additional actions - only show on larger screens */}
        <div className={styles.desktopActions}>
          {rightLabel === "Moderate" ? (
            <Button
              variant="secondary"
              data-color="brand-purple"
              icon={rightIcon}
              iconPosition="right"
              onClick={onTertiaryClick}
            >
              {tertiaryText ?? rightLabel}
            </Button>
          ) : (
            <Button
              variant="secondary"
              data-color="brand-purple"
              icon={<QrCode />}
              iconPosition="right"
              onClick={() => {
                setShowQr(true);
                onTertiaryClick?.();
              }}
              aria-label="show-qr"
            />
          )}
          <Button
            variant="secondary"
            data-color="brand-purple"
            icon={<Camera />}
            iconPosition="right"
            onClick={onSecondaryClick}
          >
            {secondaryText ?? "Take Photo"}
          </Button>
          <Button
            variant="primary"
            data-color="brand-purple"
            icon={<Upload />}
            iconPosition="right"
            onClick={onPrimaryClick}
          >
            {primaryText ?? "Upload Image"}
          </Button>
        </div>

        {rightLabel === "Moderate" ? (
          <Button
            variant="secondary"
            data-color="brand-purple"
            icon={rightIcon}
            iconPosition="right"
            onClick={onTertiaryClick}
            className={styles.rightAction}
            aria-label={rightAriaLabel ?? rightLabel}
          >
            {rightLabel}
          </Button>
        ) : (
          <Button
            variant="secondary"
            data-color="brand-purple"
            icon={<QrCode />}
            iconPosition="right"
            onClick={() => {
              // open internal QR display and also call external handler if provided
              setShowQr(true);
              onTertiaryClick?.();
            }}
            className={styles.rightAction}
            aria-label={rightAriaLabel ?? "show-qr"}
          />
        )}
      </div>

      {children ? <div className={styles.childrenWrapper}>{children}</div> : null}

      {showQr && (
        <div
          role="dialog"
          aria-modal="true"
          className={styles.qrOverlay}
          onClick={() => setShowQr(false)}
        >
          <div
            className={styles.qrDialog}
            role="document"
            onClick={e => e.stopPropagation()}
          >
            <button
              className={styles.qrClose}
              aria-label="Close QR"
              onClick={() => setShowQr(false)}
            >
              ✕
            </button>
            <QRDisplay
              value={
                qrValue ??
                (typeof window !== "undefined"
                  ? window.location.href
                  : "https://example.com")
              }
              size={qrSize}
            />
          </div>
        </div>
      )}
    </header>
  );
};

export default PhoneHeader;
