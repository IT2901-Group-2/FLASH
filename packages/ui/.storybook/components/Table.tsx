import styles from "./Table.module.css";

export type TableData = {
  data: {
    header: string[];
    valuePairs: Array<{ [key: string]: string }>;
  };
};

export const Table = ({ data }: TableData) => {
  const dataKeys = data.valuePairs.length > 0 ? Object.keys(data.valuePairs[0]) : [];

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          {data.header.map((headerItem, index) => (
            <th key={index}>{headerItem}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.valuePairs.map((row, i) => (
          <tr key={i}>
            {dataKeys.map((key, index) => (
              <td key={index}>{row[key]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
