import type { ReactNode } from "react";
import { User, Camera, Upload } from "lucide-react";
import { cl } from "../../util/className";
import styles from "./PhoneHeader.module.css";
import { Button } from "../Button";

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
  /** Visual style for the right action pill. */
  rightVariant?: "primary" | "secondary" | "tertiary";
  /** Optional CSS class name for custom styling. */
  className?: string;
  /** Number of uploads remaining (shown on desktop only). */
  uploadsRemaining?: number;
  /** Click handler for the Upload Image button (desktop only). */
  onUploadClick?: () => void;
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
  className,
  uploadsRemaining,
  onUploadClick,
}: PhoneHeaderProps) => {
  const handleLeftClick =
    onLeftClick ??
    (() => {
      if (typeof window !== "undefined") {
        window.history.back();
      }
    });

  return (
    <header className={cl(styles.phoneheader, styles.container, className)}>
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
        {rightLabel === "Moderate" && (
          <Button
            variant="secondary"
            data-color="brand-purple"
            icon={rightIcon}
            iconPosition="right"
            onClick={onTertiaryClick}
          >
            {rightLabel}
          </Button>
        )}
        <Button
          variant="secondary"
          data-color="brand-purple"
          icon={<Camera />}
          iconPosition="right"
          onClick={onSecondaryClick}
        >
          Take Photo
        </Button>
        <Button
          variant="primary"
          data-color="brand-purple"
          icon={<Upload />}
          iconPosition="right"
          onClick={onPrimaryClick}
        >
          Upload Image
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
        <span className={styles.rightSpacer} />
      )}
    </header>
  );
};

export default PhoneHeader;
