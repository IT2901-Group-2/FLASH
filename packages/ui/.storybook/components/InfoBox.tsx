import React from "react";
import styles from "./InfoBox.module.css";

export interface InfoBoxProps {
  title: string;
  icon?: React.ReactNode;
  color?: "gray" | "blue" | "green" | "yellow" | "red";
  children: React.ReactNode;
}

export const InfoBox: React.FC<InfoBoxProps> = ({ title, icon, color, children }) => {
  const colorClasses: { [key: string]: { color: string } } = {
    gray: { color: "#6b7280" },
    blue: { color: "#3b82f6" },
    green: { color: "#10b981" },
    yellow: { color: "#f59e0b" },
    red: { color: "#ef4444" },
  };

  const selectedColorClass = color ? colorClasses[color] : colorClasses["gray"];

  return (
    <div
      className={styles.container}
      style={{
        border: `1px solid ${selectedColorClass.color}`,
      }}
    >
      <div
        className={styles.title}
        style={{
          borderBottom: `1px solid ${selectedColorClass.color}`,
          backgroundColor: `${selectedColorClass.color}70`,
        }}
      >
        {icon && <span className={styles.icon}>{icon}</span>}
        <h3 style={{ margin: 0 }}>{title}</h3>
      </div>
      <div className={styles.content}>{children}</div>
    </div>
  );
};
