import React from "react";
import { InfoBoxProps } from "./InfoBox";
import { InfoBox } from "./InfoBox";

export interface CodeBoxProps extends InfoBoxProps {
  language: string;
  copyable?: boolean;
}

export const CodeBox: React.FC<CodeBoxProps> = ({
  title,
  icon,
  color,
  children,
  language,
  // copyable,
}) => {
  return (
    <InfoBox title={title} color={color} icon={icon}>
      <pre>
        <code className={language}>{children}</code>
      </pre>
    </InfoBox>
  );
};
