import { ColorName } from "@/styles/colors";
import styles from "./ProgressDots.module.css";
import { cl } from "@/util/className";

export interface ProgressDotProps {
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
   * Position of the line relative to the progress dot.
   * @default "right"
   */
  linePosition?: "left" | "right";
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
  linePosition = "right",
  "data-color": color = "neutral",
  disabled,
}) => {
  return (
    <div
      data-color={color}
      className={cl(styles.progressDot, disabled && styles.disabled)}
    >
      {linePosition === "left" && showLine && (
        <div className={cl(styles.dotLine, styles.left)}></div>
      )}
      {text?.slice(0, 2)}
      {linePosition === "right" && showLine && (
        <div className={cl(styles.dotLine, styles.right)}></div>
      )}
    </div>
  );
};

export interface ProgressDotsProps {
  temp: string;
}

export const ProgressDots = ({ temp }: ProgressDotsProps) => {
  return <>{temp}</>;
};
export default ProgressDots;
