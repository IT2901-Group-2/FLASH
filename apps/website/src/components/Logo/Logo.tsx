import { Camera } from "lucide-react";
import styles from "./CameraIcon.module.css";

const CameraIcon = () => {
  return (
    <div className={styles.cameraWrapper}>
      <Camera className={styles.camera} />
    </div>
  );
};

export default CameraIcon;
