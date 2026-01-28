import React from "react";
import styles from "./Card.module.css";
import { cl } from "../../util/className";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Card content. */
  children?: React.ReactNode;
  /**
   * Changes visual style of the card.
   * @default "primary"
   */
  variant?: "primary" | "secondary" | "dark";
  /**
   * Overrides inherited color.
   */
  "data-color"?: "accent" | "neutral" | "brand-purple";
}

/**
 * A card component for displaying content in a contained structure.
 * @example
 * ```jsx
 * <Card>
 *   <h2>Card Title</h2>
 *   <p>Card content goes here</p>
 * </Card>
 * ```
 */
export const Card = ({
  variant = "primary",
  children,
  "data-color": data = "brand-purple",
  className,
  ...rest
}: CardProps) => {
  return (
    <div
      data-color={data}
      data-variant={variant}
      className={cl(
        styles.card,
        styles[`card--${variant}`],
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
};

export default Card;
