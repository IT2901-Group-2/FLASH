import { useState } from "react";
import { InfoBoxProps } from "./InfoBox";
import { Copy, CopyCheck } from "lucide-react";
import styles from "./InfoBox.module.css";

export interface CodeBoxProps extends InfoBoxProps {
  language: string;
  copyable?: boolean;
  children: string;
}

export const CodeBox = ({ title, language, children }: CodeBoxProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <div className={styles.container} data-color="primary">
      <div className={styles.titleContainer}>
        <h4 className={styles.title}>{title}</h4>
        <button className={styles.copyButton} onClick={handleCopy}>
          {copied ? <CopyCheck /> : <Copy />}
        </button>
      </div>
      {/* Code Content */}
      <pre className={styles.content}>
        <code lang={language}>{children}</code>
      </pre>
    </div>
  );
};
