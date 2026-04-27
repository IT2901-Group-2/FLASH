import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@flash/ui";
import Image from "next/image";
import type { Image as EventImage } from "@/db";
import styles from "./ImagePreview.module.css";

interface ImagePreviewProps {
  images: EventImage[];
}

export interface ImagePreviewHandle {
  open: (index: number) => void;
}

export const ImagePreview = forwardRef<ImagePreviewHandle, ImagePreviewProps>(
  ({ images }, ref) => {
    const [previewIndex, setPreviewIndex] = useState<number | null>(null);
    const touchStartX = useRef<number | null>(null);
    const isValidIndex =
      previewIndex !== null && previewIndex >= 0 && previewIndex < images.length;

    useImperativeHandle(
      ref,
      () => ({
        open: (index: number) => setPreviewIndex(index),
      }),
      []
    );

    const closePreview = () => setPreviewIndex(null);

    const nextPreviewImage = useCallback(() => {
      setPreviewIndex((prev) => {
        if (prev === null || images.length === 0) return prev;
        return (prev + 1) % images.length;
      });
    }, [images.length]);

    const prevPreviewImage = useCallback(() => {
      setPreviewIndex((prev) => {
        if (prev === null || images.length === 0) return prev;
        return (prev - 1 + images.length) % images.length;
      });
    }, [images.length]);

    useEffect(() => {
      if (previewIndex === null) return;
      const bodyLockedClass = styles.bodyLocked;
      if (!bodyLockedClass) return;

      document.body.classList.add(bodyLockedClass);

      return () => {
        document.body.classList.remove(bodyLockedClass);
      };
    }, [previewIndex]);

    useEffect(() => {
      if (previewIndex === null) return;

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          setPreviewIndex(null);
        } else if (event.key === "ArrowRight") {
          event.preventDefault();
          nextPreviewImage();
        } else if (event.key === "ArrowLeft") {
          event.preventDefault();
          prevPreviewImage();
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [previewIndex, nextPreviewImage, prevPreviewImage]);

    const handlePreviewTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
      touchStartX.current = event.touches[0]?.clientX ?? null;
    };

    const handlePreviewTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
      if (touchStartX.current === null) return;
      const endX = event.changedTouches[0]?.clientX;
      if (typeof endX !== "number") return;

      const deltaX = endX - touchStartX.current;
      touchStartX.current = null;

      if (Math.abs(deltaX) < 40) return;

      if (deltaX > 0) {
        prevPreviewImage();
      } else {
        nextPreviewImage();
      }
    };

    if (previewIndex === null || images.length === 0 || !isValidIndex) return null;

    const currentImage = images[previewIndex as number]!;
    const eventId = currentImage.eventId;
    const altText = `Image ${previewIndex + 1} of ${images.length}`;

    const previewImage = {
      src: `/api/events/${eventId}/images/${currentImage.id}`,
      alt: altText,
    };

    return (
      <div
        className={styles.previewPage}
        role="dialog"
        aria-modal="true"
        onTouchStart={handlePreviewTouchStart}
        onTouchEnd={handlePreviewTouchEnd}
      >
        <Image
          fill
          src={previewImage.src}
          alt={previewImage.alt}
          className={styles.previewFullscreenImage}
          sizes="100vw"
        />
        <Button
          className={styles.previewClose}
          onClick={closePreview}
          variant="icon"
          icon={<X />}
        />
        {images.length > 1 && (
          <>
            <Button
              className={styles.previewNavButtonLeft}
              onClick={prevPreviewImage}
              variant="icon"
              icon={<ChevronLeft />}
            />
            <Button
              className={styles.previewNavButtonRight}
              onClick={nextPreviewImage}
              variant="icon"
              icon={<ChevronRight />}
            />
          </>
        )}
      </div>
    );
  }
);

ImagePreview.displayName = "ImagePreview";
