import React from "react";
import { Loader } from "../Loader/Loader";
import styles from "./ImageCard.module.css";
import { cl } from "../../util/className";
import { ColorName } from "@/styles/colorType";

export interface ImageCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Image source URL */
  src: string;
  /** Image alt text for accessibility */
  alt: string;
  /** Card title */
  title: string;
  /**
   * Changes design and styling.
   * @default "primary"
   */
  variant?: "primary" | "secondary" | "tertiary";
  /**
   * Changes padding, dimensions and font-size
   * @default "medium"
   */
  size?: "large" | "medium" | "small";
  /**
   * Shows a loader overlay on the image
   * @default false
   */
  loading?: boolean;
  /**
   * Overrides inherited color.
   */
  "data-color"?: ColorName;
  /**
   * Shows rejected state styling
   * @default false
   */
  rejected?: boolean;
  /**
   * Shows approved state styling
   * @default false
   */
  approved?: boolean;
  /**
   * Shows selected state styling
   * @default false
   */
  selected?: boolean;
  /**
   * Shows pending state styling
   * @default false
   */
  pending?: boolean;
  /**
   * Icon to display in the corner of the image
   */
  icon?: React.ReactNode;

  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  /**
   * Ref to the div element
   */
  ref?: React.Ref<HTMLDivElement>;
}

/**
 * An image card component with a title
 * @example
 * ```jsx
 * <ImageCard src="/path/to/image.jpg" alt="Description" title="My Image" />
 * ```
 */
export const ImageCard = ({
  variant = "primary",
  src,
  alt,
  title,
  size = "medium",
  loading = false,
  rejected = false,
  approved = false,
  selected = false,
  pending = false,
  icon,
  "data-color": data = "brand-purple",
  onClick,
  ref,
  ...rest
}: ImageCardProps) => {
  return (
    <div
      data-color={data}
      data-variant={variant}
      data-size={size}
      ref={ref}
      className={cl(
        styles.imageCard,
        loading && styles.loading,
        rejected && styles.rejected,
        approved && styles.approved,
        selected && styles.selected,
        pending && styles.pending
      )}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? e => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick(e as any);
              }
            }
          : undefined
      }
      {...rest}
    >
      <div className={styles.imageWrapper}>
        {loading && (
          <div className={styles.loaderOverlay}>
            <Loader size={size} />
          </div>
        )}
        <img src={src} alt={alt} className={styles.image} />
      </div>
      <div className={styles.titleBox}>
        <h3 className={styles.title}>
          {icon && <span className={styles.icon}>{icon}</span>}
          <span className={styles.titleText}>{title}</span>
        </h3>
      </div>
    </div>
  );
};

export default ImageCard;
