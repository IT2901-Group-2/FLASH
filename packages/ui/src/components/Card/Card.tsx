import React from "react";
import styles from "./Card.module.css";
import { cl } from "../../util/className";
import { ColorName } from "@/styles/colorType";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Card content. */
  children?: React.ReactNode;
  /**
   * Overrides inherited color.
   */
  "data-color"?: ColorName;
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
  children,
  "data-color": data = "background-secondary",
  className,
  ...rest
}: CardProps) => {
  return (
    <div
      data-color={data}
      className={cl(styles.card, className)}
      {...rest}
    >
      {children}
    </div>
  );
};

export default Card;
