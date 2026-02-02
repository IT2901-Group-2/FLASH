import React from "react";
import { Loader } from "../Loader/Loader";
import styles from "./Carousel.module.css";
import { cl } from "../../util/className";
import { ColorName } from "@/styles/colorType";
import { omit } from "@/util/omit";

export interface CarouselProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Carousel Content. */
    children?: React.ReactNode;

  "data-color"?: ColorName;
}

/**
 * A Carousel allows the user to browse through a set of items.
 */
export const Carousel = ({
  children,
  "data-color": data = "neutral",
    ...rest
}: CarouselProps) => {
  return (
    <div
        className={cl(styles.carousel)}
        data-color={data}
        {...rest}
    >
      {children}
    </div>
  );
}




