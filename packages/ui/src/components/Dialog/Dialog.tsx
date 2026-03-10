import { HTMLAttributes, RefAttributes } from "react";
import { Card } from "../Card";
import styles from "./Dialog.module.css";
import { cl } from "@/util/helpers";

export type DialogProps = RefAttributes<HTMLDialogElement> &
  HTMLAttributes<HTMLDialogElement> & {
    /**
     * Fired when closed
     */
    // onClose?: () => void;
    /**
     * Fired when opened
     */
    // onOpen?: () => void;
    /**
     * If clicking outside closes the dialog
     * @default false
     */
    // closeOnBackdrop?: boolean;
    /**
     * If pressing Escape closes the dialog
     *
     */
    // closeOnEscape?: boolean;
    /**
     * Body content
     */
    children?: React.ReactNode;
  };

const Dialog = ({ ref, children, className, ...rest }: DialogProps) => {
  return (
    <dialog ref={ref} className={styles.container} autoFocus {...rest}>
      <Card className={cl(styles.card, className)}>{children}</Card>
    </dialog>
  );
};
export default Dialog;
