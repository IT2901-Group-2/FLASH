import { HTMLAttributes, RefAttributes } from "react";
import { Card } from "../Card";
import styles from "./Dialog.module.css";
import { cl } from "@/util/helpers";

export type DialogProps = RefAttributes<HTMLDialogElement> &
  HTMLAttributes<HTMLDivElement> & {
    /**
     * Fired when closed
     */
    // onClose?: () => void;
    /**
     * Fired when opened
     */
    // onOpen?: () => void;
    /**
     * Native dialog close behavior.
     * - 'none': cannot be closed by platform interactions
     * - 'closerequest': can close via Escape/back
     * - 'any': can also close by clicking outside
     */
    closedby?: "none" | "closerequest" | "any";
    /**
     * Body content
     */
    children?: React.ReactNode;
  };

const Dialog = ({
  ref,
  children,
  className,
  closedby = "none",
  ...rest
}: DialogProps) => {
  return (
    <dialog ref={ref} className={styles.container} autoFocus closedby={closedby}>
      <Card className={cl(styles.card, className)} {...rest}>
        {children}
      </Card>
    </dialog>
  );
};
export default Dialog;
