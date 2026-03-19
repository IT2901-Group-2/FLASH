import { HTMLAttributes, MouseEvent, RefAttributes } from "react";
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
    closeOnBackdrop?: boolean;
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

const Dialog = ({ ref, children, className, closeOnBackdrop = false, onClick, ...rest 
}: DialogProps) => {
  const handleClick = (event: MouseEvent<HTMLDialogElement>) => {
    onClick?.(event);

    if (event.defaultPrevented || !closeOnBackdrop) {
      return;
    }

    if (event.target === event.currentTarget) {
      event.currentTarget.close();
    }
  };

  return (
    <dialog ref={ref} className={styles.container} autoFocus onClick={handleClick} {...rest}>
      <Card className={cl(styles.card, className)}>{children}</Card>
    </dialog>
  );
};
export default Dialog;
