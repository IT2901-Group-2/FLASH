import { Camera } from "lucide-react";
import styles from "./Logo.module.css";

export default function Logo() {
  return (
    <div className={styles.cameraWrapper}>
      <Camera className={styles.camera} />
    </div>
  );
}
