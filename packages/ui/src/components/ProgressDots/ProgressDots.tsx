import { ColorName } from "../types";
import styles from "./ProgressDots.module.css";
import { cl } from "@/util/helpers/";

interface ProgressDotProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Text to be displayed inside the progress dot. Only the first two characters will be shown.
   * @default undefined
   */
  text?: string;
  /**
   * Try not to use for accesebility reasons.
   *
   * Makes the color of the dot look non-active.
   */
  disabled?: boolean;
  /**
   * Color of the progress dot.
   * @default "neutral"
   */
  "data-color"?: ColorName;
}

const ProgressDot: React.FC<ProgressDotProps> = ({
  text,
  "data-color": color,
  disabled,
  ...rest
}) => {
  return (
    <>
      <div
        data-color={color}
        className={cl(styles.progressDot, disabled && styles.disabled)}
        {...rest}
      >
        {text?.slice(0, 2)}
      </div>
    </>
  );
};

export interface ProgressDotsProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The value of the progressdot with the highest number.
   */
  maxValue: number;
  /**
   * Current value of the progress dots.
   */
  value?: number;
  /**
   * Color of the progress dot.
   * @default "neutral"
   */
  "data-color"?: ColorName;
  /**
   * Thickness of the line between the dots.
   * @default "medium"
   */
  lineThickness?: "thin" | "medium" | "thick";
}

/**
 * ProgressDots shows which step the user is at in an form dialog.
 *
 * > _Last updated: `2026-02-02`_
 *
 * ### Suitable for:
 * - Form dialogues
 */
export const ProgressDots = ({
  maxValue,
  value = 0,
  lineThickness = "medium",
  "data-color": color = "neutral",
  ...rest
}: ProgressDotsProps) => {
  return (
    <div className={styles.progressDots} data-color={color} {...rest}>
      <div className={styles.dotLine} line-type={lineThickness}>
        <div
          className={styles.progressLine}
          style={
            { "--progress": `${(value - 1) / (maxValue - 1)}` } as React.CSSProperties
          }
        ></div>
      </div>
      {Array.from({ length: maxValue }, (_, i) => (
        <ProgressDot
          key={i}
          text={String(i + 1)}
          disabled={i + 1 > value}
          data-color={color}
        />
      ))}
    </div>
  );
};
export default ProgressDots;
