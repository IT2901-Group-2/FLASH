import { GetImagesPage, Image } from "@/db";
import { useLoadMore } from "@/hooks/useLoadMore";
import { InfiniteData, UseInfiniteQueryResult } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { FC } from "react";
import ImageCard, { ImageCardState } from "../ImageCard/ImageCard";
import { getImageSrc } from "@/lib/utils/images";
import styles from "./PhotoList.module.css";

export type PhotoListProps = {
  eventId: string;
  query: UseInfiniteQueryResult<InfiniteData<GetImagesPage>>;
  loadingText: string;
  setState?: (image: Image) => ImageCardState | undefined;
  onClick?: (_: { id: string; index: number }) => void;
};

export const PhotoList: FC<PhotoListProps> = ({
  eventId,
  query,
  loadingText,
  setState,
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
          loader={({ width }) => getImageSrc(eventId, image.id, { width })}
          src={getImageSrc(eventId, image.id)}
          alt={tUpload("imageAlt", {
            index: index + 1,
            total: images.length,
          })}
          title={tUpload("imageTitle", { index: index + 1 })}
          placeholder={image.previewImage}
          state={setState && setState(image)}
          onClick={() => onClick && onClick({ id: image.id, index })}
        />
      ))}
      {hasNextPage && <div ref={loadMoreRef} className={styles.loadMoreSentinel} />}
    </div>
  );
};
