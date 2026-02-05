import React, { useRef, useState, useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import styles from "./Carousel.module.css";
import { cl } from "../../util/className";
import { ColorName } from "@/styles/colorType";

export interface CarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Carousel Content. */
  children?: React.ReactNode;
  /** Color theme */
  "data-color"?: ColorName;
  /** Gap between items (in rem) */
  gap?: number;
  /** Show scroll indicator */
  showIndicator?: boolean;
  /** Indicator text */
  indicatorText?: string;
  /** Indicator click handler */
  onIndicatorClick?: () => void;
  /** Show navigation arrows */
  showArrows?: boolean;
}

/**
 * A Carousel allows the user to browse through a set of items.
 */
export const Carousel = ({
  children,
  "data-color": data = "neutral",
  gap = 1,
  showIndicator = false,
  indicatorText = "Scroll to see more",
  onIndicatorClick,
  showArrows = true,
  className,
  ...rest
}: CarouselProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
      setCanScrollLeft(scrollLeft > 5);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [children]);

  return (
    <div className={cl(styles.carouselWrapper, className)} data-color={data} {...rest}>
      <div
        ref={scrollContainerRef}
        className={styles.carousel}
        onScroll={checkScroll}
        style={{ gap: `${gap}rem` }}
      >
        {children}
      </div>
      {showArrows && (
        <>
          <button
            type="button"
            className={styles.navButton}
            data-direction="left"
            onClick={() => {
              if (scrollContainerRef.current) {
                scrollContainerRef.current.scrollBy({
                  left: -scrollContainerRef.current.clientWidth,
                  behavior: "smooth",
                });
              }
            }}
            disabled={!canScrollLeft}
            aria-label="Scroll left"
          >
            <ArrowLeft size={18} />
          </button>
          <button
            type="button"
            className={styles.navButton}
            data-direction="right"
            onClick={() => {
              if (scrollContainerRef.current) {
                scrollContainerRef.current.scrollBy({
                  left: scrollContainerRef.current.clientWidth,
                  behavior: "smooth",
                });
              }
            }}
            disabled={!canScrollRight}
            aria-label="Scroll right"
          >
            <ArrowRight size={18} />
          </button>
        </>
      )}
      {showIndicator && (
        <button
          type="button"
          className={styles.scrollIndicator}
          onClick={onIndicatorClick}
        >
          {indicatorText}
          <ArrowRight size={16} />
        </button>
      )}
    </div>
  );
};
