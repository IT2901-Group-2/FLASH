import React from "react";
import { ColorName } from "../types";
import { Card } from "../Card";
import { Button, ButtonProps } from "../Button";
import styles from "./ActionCard.module.css";
import { cl } from "@/util/helpers/";

export interface ActionCardButtonConfig extends Omit<ButtonProps, "children"> {
  text: React.ReactNode;
  icon?: React.ReactNode;
}

export interface ActionCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Optional description text shown at the top
   */
  description?: string;
  /**
   * Description text color
   * @default "neutral"
   */
  descriptionColor?: ColorName;
  /**
   * Primary button configuration
   */
  primaryButton?: ActionCardButtonConfig;
  /**
   * Secondary button configuration
   */
  secondaryButton?: ActionCardButtonConfig;
  /**
   * Overrides inherited color for the card.
   */
  "data-color"?: ColorName;
  /** Additional content (children). */
  children?: React.ReactNode;
}

/**
 * An action card allows the user to interact with primary and secondary
 * actions. This could be used for prompting the user to take an action, such
 * as uploading a photo or taking a new one. It could also be used for routing
 * and navigation purposes, or to save changes.
 *
 * > _Last updated: `2026-02-07`_
 */
export const ActionCard = ({
  description,
  descriptionColor = "neutral",
  primaryButton,
  secondaryButton,
  "data-color": color = "neutral",
  className,
  children,
  ...rest
}: ActionCardProps) => {
  return (
    <Card data-color={color} className={cl(styles.actionCard, className)} {...rest}>
      {description && (
        <p className={styles.description} data-color={descriptionColor}>
          {description}
        </p>
      )}
      {children}
      {(secondaryButton || primaryButton) && (
        <div className={styles.buttonsContainer}>
          {secondaryButton && (
            <Button {...secondaryButton} variant="secondary">
              {secondaryButton.text}
            </Button>
          )}
          {primaryButton && <Button {...primaryButton}>{primaryButton.text}</Button>}
        </div>
      )}
    </Card>
  );
};

export default ActionCard;
