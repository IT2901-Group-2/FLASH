import { Camera } from "lucide-react";
import styles from "./Logo.module.css";

export default function Logo({
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={styles.cameraWrapper} {...rest}>
      <Camera className={styles.camera} />
    </div>
  );
}
