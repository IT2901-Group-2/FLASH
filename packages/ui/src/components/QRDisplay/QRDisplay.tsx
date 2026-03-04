import styles from "./QRDisplay.module.css";
import QRCode from "react-qr-code";
import { cl } from "@//util/helpers/className";
import { BgInput, Neutral1000 } from "@flash/tokens/js";

export interface QRDisplayProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The value that the QRCode will display
   */
  value: string;
  /**
   * A code that is shown under the QRCode
   */
  code?: string;
  /**
   * Optional named size for the QR code. Allowed values: 'small' | 'medium' | 'large'.
   * When omitted the component defaults to 'medium'. Sizes are defined in CSS.
   */
  size?: "small" | "medium" | "large";
}

/**
 * Displays a high-error-correction QR code with optional supporting text.
 *
 * Commonly used to allow users to scan and upload photos from a mobile device.
 *
 * > _Last updated: `2026-02-07`_
 */
const QRDisplay = ({
  value,
  code,
  size = "medium",
  className,
  ...rest
}: QRDisplayProps) => {
  return (
    <div data-size={size} className={cl(styles.container, className)} {...rest}>
      <QRCode
        value={value}
        level="H"
        className={styles.qrCode}
        bgColor={BgInput}
        fgColor={Neutral1000}
      />
      <div className={styles.text}>
        {code && <span className={styles.code}>{code}</span>}
        <span className={styles.helperText}>Scan to upload photos</span>
      </div>
    </div>
  );
};
export default QRDisplay;
