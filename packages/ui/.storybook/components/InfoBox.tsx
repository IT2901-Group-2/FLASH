import React from "react";
import styles from "./InfoBox.module.css";
import { ColorRole } from "@flash/tokens/types";

export interface InfoBoxProps {
  title: string;
  icon?: React.ReactNode;
  "data-color"?: ColorRole;
  children: React.ReactNode;
}

export const InfoBox: React.FC<InfoBoxProps> = ({
  title,
  icon,
  "data-color": color = "neutral",
  children,
}) => {
  return (
    <div className={styles.container} data-color={color}>
      <div className={styles.titleContainer}>
        {icon && <span className={styles.icon}>{icon}</span>}
        <h4 className={styles.title}>{title}</h4>
      </div>
      <div className={styles.content}>{children}</div>
    </div>
  );
};
