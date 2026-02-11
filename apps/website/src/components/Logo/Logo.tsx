import { Camera } from "lucide-react";
import styles from "./Logo.module.css";

export default function Logo({ ...rest }) {
  return (
    <div className={styles.cameraWrapper} {...rest}>
      <Camera className={styles.camera} />
    </div>
  );
}
