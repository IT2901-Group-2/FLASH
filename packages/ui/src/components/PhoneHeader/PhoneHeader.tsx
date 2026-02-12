import type { ReactNode } from "react";
import { cl } from "../../util/className";
import styles from "./PhoneHeader.module.css";

export interface PhoneHeaderProps {
  /** The title to display in the phone header. */
  title: string;
  /** Optional subtitle shown beneath the title. */
  subtitle?: string;
  /** Optional icon to display before the subtitle text. */
  subtitleIcon?: ReactNode;
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
  /** Click handler for the right action. */
  onRightClick?: () => void;
  /** Visual style for the right action pill. */
  rightVariant?: "primary" | "secondary";
  /** Optional CSS class name for custom styling. */
  className?: string;
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
  subtitleIcon,
  leftIcon,
  leftAriaLabel = "Go back",
  onLeftClick,
  rightLabel,
  rightIcon,
  rightAriaLabel,
  onRightClick,
  rightVariant = "primary",
  className,
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
            {subtitleIcon ? (
              <span className={styles.iconWrapper}>{subtitleIcon}</span>
            ) : null}
            <span>{subtitle}</span>
          </div>
        ) : null}
      </div>

      {rightLabel ? (
        onRightClick ? (
          <button
            type="button"
            className={cl(
              styles.rightAction,
              rightVariant === "secondary" ? styles.rightSecondary : styles.rightPrimary,
              styles.rightActionButton
            )}
            onClick={onRightClick}
            aria-label={rightAriaLabel ?? rightLabel}
          >
            <span>{rightLabel}</span>
            {rightIcon ? <span className={styles.iconWrapper}>{rightIcon}</span> : null}
          </button>
        ) : (
          <div
            className={cl(
              styles.rightAction,
              rightVariant === "secondary" ? styles.rightSecondary : styles.rightPrimary
            )}
            aria-label={rightAriaLabel ?? rightLabel}
          >
            <span>{rightLabel}</span>
            {rightIcon ? <span className={styles.iconWrapper}>{rightIcon}</span> : null}
          </div>
        )
      ) : (
        <span className={styles.rightSpacer} />
      )}
    </header>
  );
};

export default PhoneHeader;
