import { GetImagesPage } from "@/db";
import { useLoadMore } from "@/hooks/useLoadMore";
import { InfiniteData, UseInfiniteQueryResult } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { FC } from "react";
import ImageCard from "../ImageCard/ImageCard";
import { getImageSrc } from "@/lib/utils/images";
import styles from "./PhotoList.module.css";

export type PhotoListProps = {
  eventId: string;
  query: UseInfiniteQueryResult<InfiniteData<GetImagesPage>>;
  loadingText: string;
  onClick?: (idx: number) => void;
};

export const PhotoList: FC<PhotoListProps> = ({
  eventId,
  query,
  loadingText,
  onClick,
}) => {
  const tUpload = useTranslations("guest.event.upload");
  const loadMoreRef = useLoadMore(query);

  const { data, hasNextPage, isLoading } = query;
  const images = data?.pages.flatMap(page => page.items) ?? [];

  if (isLoading || images.length === 0) {
    return (
      <div role="status" className={styles.emptyState}>
        {loadingText}
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {images.map((image, index) => (
        <ImageCard
          key={image.id}
          src={getImageSrc(eventId, image.id, { width: 200, height: 200 })}
          alt={tUpload("imageAlt", {
            index: index + 1,
            total: images.length,
          })}
          title={tUpload("imageTitle", { index: index + 1 })}
          data-image-id={image.id}
          placeholder={image.previewImage}
          state={
            image.isApproved === null
              ? "pending"
              : image.isApproved === false
                ? "rejected"
                : undefined
          }
          onClick={() => onClick && onClick(index)}
        />
      ))}
      {hasNextPage && <div ref={loadMoreRef} className={styles.loadMoreSentinel} />}
    </div>
  );
};
