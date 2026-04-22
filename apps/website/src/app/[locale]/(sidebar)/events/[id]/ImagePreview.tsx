import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@flash/ui";
import Image from "next/image";
import type { Image as EventImage } from "@/db";
import styles from "./UploadImage.module.css";

interface ImagePreviewProps {
  eventId: string;
  images: EventImage[];
  previewIndex: number | null;
  setPreviewIndex: React.Dispatch<React.SetStateAction<number | null>>;
  getImageAlt: (index: number, total: number) => string;
}

export function ImagePreview({
  eventId,
  images,
  previewIndex,
  setPreviewIndex,
  getImageAlt,
}: ImagePreviewProps) {
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (previewIndex === null) return;

    const previousOverflow = document.body.style.overflow;
    const previousOverscrollBehavior = document.body.style.overscrollBehavior;

    document.body.style.overflow = "hidden";
    document.body.style.overscrollBehavior = "none";

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.overscrollBehavior = previousOverscrollBehavior;
    };
  }, [previewIndex]);

  useEffect(() => {
    if (previewIndex === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setPreviewIndex(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [previewIndex, setPreviewIndex]);

  useEffect(() => {
    if (previewIndex === null) return;
    if (images.length === 0) {
      setPreviewIndex(null);
      return;
    }

    if (previewIndex > images.length - 1) {
      setPreviewIndex(images.length - 1);
    }
  }, [images.length, previewIndex, setPreviewIndex]);

  const closePreview = () => setPreviewIndex(null);

  const nextPreviewImage = () => {
    if (previewIndex === null || images.length === 0) return;
    setPreviewIndex((previewIndex + 1) % images.length);
  };

  const prevPreviewImage = () => {
    if (previewIndex === null || images.length === 0) return;
    setPreviewIndex((previewIndex - 1 + images.length) % images.length);
  };

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

  if (previewIndex === null || !images[previewIndex]) return null;

  const previewImage = {
    src: `/api/events/${eventId}/images/${images[previewIndex].id}`,
    alt: getImageAlt(previewIndex, images.length),
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
