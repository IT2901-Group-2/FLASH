import { stripVar } from "./helpers";
import { TokenType } from "./DesignTokens";
import styles from "../Table.module.css";
import CopyButton from "@docs-components/CopyButton/CopyButton";

type DisplayTableProps = {
  tokens: TokenType[];
  renderPreview: (token: TokenType) => React.ReactNode;
};

export const DisplayTable = ({ tokens, renderPreview }: DisplayTableProps) => {
  return (
    <table className={styles.table}>
      <tbody>
        {tokens.map((token, i) => {
          return (
            <tr key={token.jsValue + i}>
              <td>{renderPreview(token)}</td>
              <td>
                <span>{stripVar(token.cssValue)}</span>
              </td>
              <td>
                <CopyButton copyValue={stripVar(token.name)} />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
