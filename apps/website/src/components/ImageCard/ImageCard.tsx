"use client";

import Image from "next/image";
import { CircleCheckBig, CircleX, Timer } from "lucide-react";
import { cl } from "@/utils/className";
import styles from "./ImageCard.module.css";

type ImageCardState =
  | "loading"
  | "rejected"
  | "approved"
  | "selected"
  | "pending"
  | "default";

export interface ImageCardProps extends React.HTMLAttributes<HTMLDivElement> {
  src: string;
  alt: string;
  title: string;
  state?: ImageCardState;
  placeholder?: string;
  ref?: React.Ref<HTMLDivElement>;
}

export const ImageCard = ({
  src,
  alt,
  state = "default",
  onClick,
  ref,
  placeholder,
  ...rest
}: ImageCardProps) => {
  return (
    <div
      data-state={state}
      ref={ref}
      className={cl(
        styles.imageCard,
        state === "selected" && styles.selected,
        state === "pending" && styles.pending,
        state === "rejected" && styles.rejected
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
        <Image
          fill
          src={src}
          alt={alt}
          className={styles.image}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          {...(placeholder ? { placeholder: "blur", blurDataURL: placeholder } : {})}
        />
        {state === "selected" && (
          <div className={styles.moderateCheckBadge} aria-hidden="true">
            <CircleCheckBig aria-hidden="true" />
          </div>
        )}
      </div>
      {(state === "pending" || state === "rejected") && (
        <div className={styles.statusLabel}>
          <span className={styles.statusIcon}>
            {state === "pending" ? <Timer /> : <CircleX />}
          </span>
          <span className={styles.statusText}>
            {state === "pending" ? "Pending..." : "Rejected"}
          </span>
        </div>
      )}
    </div>
  );
};

export default ImageCard;
