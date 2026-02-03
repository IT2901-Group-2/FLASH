import styles from "./QRDisplay.module.css";
import QRCode from "react-qr-code";

export interface QRDisplayProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The value that the QRCode will display
   */
  value: string;
  /**
   * A code that is shown under the QRCode
   */
  code?: string;
}

const QRDisplay = ({ value, code, ...rest }: QRDisplayProps) => {
  return (
    <div className={styles.container} {...rest}>
      <QRCode
        value={value}
        level="H"
        className={styles.qrCode}
        bgColor={`var(--color-neutral-000)`}
        fgColor={`var(--color-neutral-1000)`}
      />
      <div className={styles.text}>
        {code && <span className={styles.code}>{code}</span>}
        <span className={styles.helperText}>Scan to upload photos</span>
      </div>
    </div>
  );
};
export default QRDisplay;
