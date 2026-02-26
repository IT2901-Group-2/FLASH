import { Copy, CopyCheck } from "lucide-react";
import { useState } from "react";
import styles from "./CopyButton.module.css";

const CopyButton = ({ copyValue }: { copyValue: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(copyValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <button className={styles.copyButton} onClick={handleCopy}>
      {copied ? <CopyCheck /> : <Copy />}
    </button>
  );
};
export default CopyButton;
