import React from "react";
import styles from "./Title.module.css";
import { cl } from "@/util/helpers";
import { ColorName } from "../types";

export interface TitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /** Title Content. */
  children?: React.ReactNode;
  /** Optional description shown below the title */
  description?: React.ReactNode;
  /**
   * Semantic heading level
   * @default "h2"
   */
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  /**
   * Visual size (independent of semantic level)
   * @default "large"
   */
  size?: "2xlarge" | "xlarge" | "large" | "medium" | "small" | "xsmall";
  /**
   * Font weight
   * @default "semibold"
   */
  weight?: "bold" | "regular";
  /**
   * Text alignment
   * @default "left"
   */
  align?: "left" | "center" | "right";
  /**
   * Overrides inherited color.
   */
  "data-color"?: ColorName;
  /**
   * Clamp title text to this many lines, then ellipsis. Omit for single-line truncation.
   */
  lines?: number;
  /**
   * Ref to the heading element
   */
  ref?: React.Ref<HTMLHeadingElement>;
}

/**
 * A flexible title/heading component
 *
 * > _Last updated: `2026-02-02`_
 */
export const Title = ({
  as: Component = "h2",
  children,
  description,
  size = "large",
  weight = "bold",
  align = "left",
  lines,
  "data-color": color,
  ref,
  className,
  ...props
}: TitleProps) => {
  return (
    <div className={styles.wrapper}>
      <Component
        data-color={color}
        data-size={size}
        data-weight={weight}
        data-align={align}
        ref={ref}
        className={cl(styles.title, className)}
        {...props}
      >
        {children && (
          <span
            className={lines ? styles.textClamp : styles.text}
            style={lines ? { WebkitLineClamp: lines } : undefined}
          >
            {children}
          </span>
        )}
      </Component>
      {description && (
        <p data-align={align} data-size={size} className={styles.description}>
          {description}
        </p>
      )}
    </div>
  );
};

export default Title;
