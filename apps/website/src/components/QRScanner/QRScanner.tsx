import { IScannerProps, Scanner } from "@yudiel/react-qr-scanner";
import { useEffect } from "react";
import styles from "./QRScanner.module.css";

const QrScanner = ({ ...props }: IScannerProps) => {
  useEffect(() => {
    return () => {
      // Runs when component unmounts — kills the camera
      navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
        stream.getTracks().forEach(track => track.stop());
      });
    };
  }, []);

  return (
    <Scanner
      classNames={{ video: styles.video }}
      {...props}
      constraints={{
        facingMode: "enviorment",
        aspectRatio: 1,
        width: 640,
        height: 640,
      }}
    />
  );
};

export default QrScanner;
