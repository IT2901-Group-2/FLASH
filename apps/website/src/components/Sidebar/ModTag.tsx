import { ChevronRight, ImageMinus } from "lucide-react";
import { HTMLAttributes } from "react";
import styles from "./ModTag.module.css";

const ModTag = ({
  isMod,
  ...rest
}: HTMLAttributes<HTMLSpanElement> & { isMod: boolean }) => {
  return (
    <span className={styles.container} {...rest}>
      {isMod && (
        <span className={styles.tag}>
          <ImageMinus size={14} />
          Mod
        </span>
      )}
      <ChevronRight />
    </span>
  );
};

export default ModTag;
