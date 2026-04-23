"use client";

import Image, { ImageLoader } from "next/image";
import { CircleCheckBig, CircleX, Timer } from "lucide-react";
import { useCallback } from "react";
import { useTranslations } from "next-intl";
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
  loader?: ImageLoader;
}

export const ImageCard = ({
  src,
  alt,
  state = "default",
  onClick,
  ref,
  placeholder,
  loader,
  ...rest
}: ImageCardProps) => {
  const t = useTranslations("common.imageStatus");

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.currentTarget.click();
    }
  }, []);

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
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      <div className={styles.imageWrapper}>
        <Image
          fill
          loader={loader}
          src={src}
          alt={alt}
          className={styles.image}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          {...(placeholder && { placeholder: "blur", blurDataURL: placeholder })}
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
            {state === "pending" ? t("pending") : t("rejected")}
          </span>
        </div>
      )}
    </div>
  );
};

export default ImageCard;
