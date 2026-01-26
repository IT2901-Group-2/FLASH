import React, { useEffect } from "react";
import styles from "./ProgressBar.module.css";
import { cl } from "../../util/className";

export interface ProgressBarProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "role"
> {
  /**
   * Changes height.
   * @default "medium"
   */
  size?: "large" | "medium" | "small";
  /**
   * Current progress. If set, the `simulated` prop overrides `value`.
   */
  value?: number;
  /**
   * Maximum progress.
   * @default 100
   */
  maxValue?: number;
  /**
   * Visually simulates loading.
   * ProgressBar grows with a preset animation for set number of seconds,
   * then shows an indeterminate animation on timeout.
   */
  simulated?: {
    /**
     * Duration in seconds.
     */
    seconds?: number;
    /**
     * Callback function when progress is indeterminate.
     */
    onTimeout: () => void;
  };
  /**
   * Overrides inherited color.
   */
  "data-color"?: undefined;
}

export const ProgressBar = ({
  value = 0,
  maxValue = 100,
  simulated,
  size = "medium",
  ...rest
}: ProgressBarProps) => {
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    if (simulated) {
      timeoutId = setTimeout(
        () => {
          simulated.onTimeout();
        },
        (simulated.seconds ?? 5) * 1000
      );
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [simulated]);

  const translateX = -100 + (Math.min(value, maxValue) / maxValue) * 100;
  const translateXSimulated = -100 + (value / maxValue) * 100;

  return (
    <div data-color={"brand-purple"} className={cl(styles.container)}>
      <div
        className={cl(styles.filler, styles[`filler--${size}`])}
        style={{ transform: `translateX(${translateX}%)` }}
      ></div>
    </div>
  );
};
export default ProgressBar;
