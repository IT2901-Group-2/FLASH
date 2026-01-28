import { ColorName } from "@/styles/colorType";
import styles from "./ProgressDots.module.css";
import { cl } from "@/util/className";
import { IntRange } from "@/types/utility";

export interface ProgressDotProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Text to be displayed inside the progress dot. Only the first two characters will be shown.
   * @default undefined
   */
  text?: string;
  /**
   * Whether to show a line out from the progress dot.
   * @default false
   */
  showLine?: boolean;
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

export const ProgressDot: React.FC<ProgressDotProps> = ({
  text,
  showLine,
  "data-color": color = "neutral",
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
        {showLine && <div className={cl(styles.dotLine)}></div>}
      </div>
    </>
  );
};

export interface ProgressDotsProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The value of the progressdot with the highest number.
   *
   * Must in the range 2-10
   */
  maxValue: IntRange<2, 10>;
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
   * Length of the line between the dots.
   * @default "full"
   */
  lineLength?: "full" | "short";
  /**
   * Thickness of the line between the dots.
   * @default "thick"
   */
  lineThickness?: "thin" | "thick";
  /**
   * Style of the line between the dots.
   *
   *  **Only applies if lineLength is full**
   * @default "solid"
   */
  lineType?: "solid" | "dashed";
}

export const ProgressDots = ({
  maxValue,
  value,
  "data-color": color = "neutral",
}: ProgressDotsProps) => {
  if (maxValue < 2 || maxValue > 10)
    throw new Error("maxValue must be in the range 2-10");

  return (
    <div className={styles.progressDots}>
      {Array.from({ length: maxValue }, (_, i) => (
        <ProgressDot
          key={i}
          text={String(i + 1)}
          showLine={i < maxValue - 1}
          disabled={value !== undefined ? i + 1 > value : false}
          data-color={color}
          style={{ "--dot-count": maxValue, "--dot-value": i } as React.CSSProperties}
        />
      ))}
    </div>
  );
};
export default ProgressDots;
