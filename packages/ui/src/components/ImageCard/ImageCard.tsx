import React, { useCallback, useLayoutEffect, useState } from "react";
import { Loader } from "../Loader/Loader";
import styles from "./ImageCard.module.css";
import { cl } from "@/util/helpers/";
import { ColorName } from "../types";
import { CheckCheck, CircleCheckBig, CircleX, LoaderIcon, Timer, X } from "lucide-react";

type ImageCardState =
  | "loading"
  | "rejected"
  | "approved"
  | "selected"
  | "pending"
  | "default";

export interface ImageCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Changes design and styling. As of now their only exists styling for the primary variant
   * @default "primary"
   */
  variant?: "primary" | "secondary" | "tertiary" | "preview2";
  /**
   * Image source URL
   */
  src: string;
  /**
   * Image alt text for accessibility
   */
  alt: string;
  /**
   * Card title
   */
  title: string;
  /**
   * Changes padding, dimensions and font-size
   * @default "medium"
   */
  size?: "large" | "medium" | "small";
  /**
   * Overrides inherited color.
   */
  "data-color"?: ColorName;
  /**
   * Visual state of the card (loading, rejected, approved, selected, pending, or default)
   * @default "default"
   */
  state?: ImageCardState;
  /**
   * Optional icon to display in the title area when state is "default"
   */
  icon?: React.ReactNode;
  /**
   * Click handler for the card
   */
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  /**
   * Ref to the div element
   */
  ref?: React.Ref<HTMLDivElement>;

  /*
   * Image to display while `src` is loading.
   */
  placeholder?: string;
}

/**
 * An image card component that can be customized to show different state and
 * perform different types of actions.
 *
 * > _Last updated: `2026-02-07`_
 */
export const ImageCard = ({
  variant = "primary",
  src: _src,
  alt,
  title,
  size = "medium",
  state = "default",
  icon,
  "data-color": color = "brand-purple",
  onClick,
  ref,
  placeholder,
  ...rest
}: ImageCardProps) => {
  const [src, setSrc] = useState<string>(placeholder ?? _src);

  useLayoutEffect(() => {
    const image = new Image();
    image.src = _src;
    image.addEventListener("load", () => setSrc(_src), { once: true });
  }, [_src, setSrc]);

  return (
    <div
      data-color={color}
      data-variant={variant}
      data-size={size}
      data-state={state}
      ref={ref}
      className={cl(
        styles.imageCard,
        state === "loading" && styles.loading,
        state === "rejected" && styles.rejected,
        state === "approved" && styles.approved,
        state === "selected" && styles.selected,
        state === "pending" && styles.pending
      )}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-pressed={
        onClick && (state === "selected" || state === "default")
          ? state === "selected"
          : undefined
      }
      onKeyDown={
        onClick
          ? e => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick(e as unknown as React.MouseEvent<HTMLDivElement>);
              }
            }
          : undefined
      }
      {...rest}
    >
      <div className={styles.imageWrapper}>
        {state === "loading" && (
          <div className={styles.loaderOverlay}>
            <Loader size={size} />
          </div>
        )}
        {state === "rejected" && (
          <div className={styles.rejectedOverlay}>
            <X className={styles.rejectedIcon} />
          </div>
        )}
        {state === "pending" && <div className={styles.pendingOverlay}></div>}
        <img src={src} alt={alt} className={styles.image} />
        {variant === "preview2" && state === "selected" && (
          <div className={styles.moderateCheckBadge} aria-hidden="true">
            <CircleCheckBig aria-hidden="true" />
          </div>
        )}
      </div>
      <div className={styles.titleBox}>
        {state === "pending" && (
          <h3 className={styles.title}>
            <span className={styles.icon}>
              <Timer />
            </span>
            <span className={styles.titleText}>Pending...</span>
          </h3>
        )}
        {state === "loading" && (
          <h3 className={styles.title}>
            <span className={styles.icon}>
              <LoaderIcon />
            </span>
            <span className={styles.titleText}>Loading...</span>
          </h3>
        )}
        {state === "rejected" && (
          <h3 className={styles.title}>
            <span className={styles.icon}>
              <CircleX />
            </span>
            <span className={styles.titleText}>Rejected</span>
          </h3>
        )}
        {state === "selected" && (
          <h3 className={styles.title}>
            <span className={styles.icon}>
              <CheckCheck />
            </span>
            <span className={styles.titleText}>Selected</span>
          </h3>
        )}
        {state === "approved" && (
          <h3 className={styles.title}>
            <span className={styles.icon}>
              <CircleCheckBig />
            </span>
            <span className={styles.titleText}>Approved</span>
          </h3>
        )}
        {state === "default" && (
          <h3 className={styles.title}>
            {icon && <span className={styles.icon}>{icon}</span>}
            <span className={styles.titleText}>{title}</span>
          </h3>
        )}
      </div>
    </div>
  );
};

export default ImageCard;
