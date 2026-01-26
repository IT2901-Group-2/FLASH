import React from "react";
import styles from "./Chips.module.css";

export interface ChipsProps {
  children?: React.ReactNode;
  onClick?: () => void;
  active: boolean;
}

export const Chips: React.FC<ChipsProps> = ({ children, onClick, active = false }) => {
  return (
    <button className={`${styles.container} ${active ? styles.active : ""}`} onClick={onClick}>
      <span>{children}</span>
    </button>
  );
};

export default Chips;
