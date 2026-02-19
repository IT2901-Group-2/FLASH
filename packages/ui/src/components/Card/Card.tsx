import React from "react";
import styles from "./Card.module.css";
import { cl } from "../../util/className";
import { ColorName } from "@/styles/colorType";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Card content.
   */
  children?: React.ReactNode;
  /**
   * Overrides inherited color.
   */
  "data-color"?: ColorName;
}

/**
 * A card component for displaying content in a contained structure.
 *
 * > _Last updated: `2026-02-07`_
 */
export const Card = ({
  children,
  "data-color": color = "neutral",
  className,
  ...rest
}: CardProps) => {
  return (
    <div data-color={color} className={cl(styles.card, className)} {...rest}>
      {children}
    </div>
  );
};

export default Card;
