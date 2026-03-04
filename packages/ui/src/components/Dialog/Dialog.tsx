import { RefAttributes } from "react";
import { Card } from "../Card";
import styles from "./Dialog.module.css";

export interface DialogProps extends RefAttributes<HTMLDialogElement> {
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
}

const Dialog = ({ ref, children, ...rest }: DialogProps) => {
  return (
    <dialog ref={ref} className={styles.container} autoFocus {...rest}>
      <Card className={styles.card}>{children}</Card>
    </dialog>
  );
};
export default Dialog;
