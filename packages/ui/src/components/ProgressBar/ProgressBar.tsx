import React, { useEffect, useState } from "react";
import styles from "./ProgressBar.module.css";
import { cl } from "../../util/className";
import { ColorName } from "@/styles/colorType";

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
   * @default "brand-purple"
   */
  "data-color"?: ColorName;
}

export const ProgressBar = ({
  value = 0,
  maxValue = 100,
  simulated,
  size = "medium",
  "data-color": data = "brand-purple",
  ...rest
}: ProgressBarProps) => {
  const [isIndeterminate, setIsIndeterminate] = useState<boolean>(false);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    if (simulated) {
      timeoutId = setTimeout(
        () => {
          simulated.onTimeout();
          setIsIndeterminate(true);
        },
        (simulated.seconds ?? 5) * 1000
      );
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [simulated]);

  const translateX = -100 + (Math.min(value, maxValue) / maxValue) * 100;
  const animationDuration = simulated ? `${simulated.seconds ?? 5}s` : undefined;

  return (
    <div data-color={data} className={cl(styles.container)}>
      <div
        className={cl(
          styles.filler,
          styles[`filler--${size}`],
          simulated && !isIndeterminate && styles.fillerSimulated,
          isIndeterminate && styles.fillerIndeterminate
        )}
        style={{
          transform: `translateX(${translateX}%)`,
          animationDuration: animationDuration,
        }}
      ></div>
    </div>
  );
};
export default ProgressBar;
