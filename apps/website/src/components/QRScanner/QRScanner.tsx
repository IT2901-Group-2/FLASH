import { IScannerProps, Scanner } from "@yudiel/react-qr-scanner";
import { useEffect } from "react";
import styles from "./QRScanner.module.css";

const QrScanner = ({ ...props }: IScannerProps) => {
  useEffect(() => {
    return () => {
      // Runs when component unmounts. Kills the camera
      navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
        stream.getTracks().forEach(track => track.stop());
      });
    };
  }, []);

  return (
    <div className={styles.wrapper}>
      <Scanner
        classNames={{ video: styles.video }}
        {...props}
        sound={"/flash.wav"}
        constraints={{
          facingMode: "enviorment",
          aspectRatio: 1,
          width: 640,
          height: 640,
        }}
        components={{
          finder: false,
        }}
      />
      <div className={styles.finder} data-testid="finder-overlay" />
    </div>
  );
};

export default QrScanner;
