import React from "react";
import styles from "./Title.module.css";
import { cl } from "../../util/className";

export interface TitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /** Title Content. */
  children?: React.ReactNode;
  /**
   * Semantic heading level
   * @default "h2"
   */
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  /**
   * Visual size (independent of semantic level)
   * @default "large"
   */
  size?: "xlarge" | "large" | "medium" | "small";
  /**
   * Font weight
   * @default "semibold"
   */
  weight?: "bold" | "semibold" | "medium";
  /**
   * Text alignment
   * @default "left"
   */
  align?: "left" | "center" | "right";
  /**
   * Overrides inherited color.
   */
  "data-color"?: "accent" | "neutral" | "brand-purple";
  /**
   * Ref to the heading element
   */
  ref?: React.Ref<HTMLHeadingElement>;
}

/**
 * A flexible title/heading component
 * @example
 * ```jsx
 * <Title as="h1" size="xlarge">Page Title</Title>
 * ```
 */
export const Title = ({
  as: Component = "h2",
  children,
  size = "large",
  weight = "semibold",
  align = "left",
  "data-color": data = "brand-purple",
  ref,
  className,
  ...props
}: TitleProps) => {
  return (
    <Component
      data-color={data}
      data-size={size}
      data-weight={weight}
      data-align={align}
      ref={ref}
      className={cl(styles.title, className)}
      {...props}
    >
      {children && <span className={styles.text}>{children}</span>}
    </Component>
  );
};

export default Title;
