import styles from "./Table.module.css";

export type TableData = {
  header: string[];
  data: Array<{ [key: string]: string }>;
};

export const Table = ({ header, data }: TableData) => {
  const dataKeys = data.length > 0 ? Object.keys(data[0]) : [];

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          {header.map((headerItem, index) => (
            <th className={styles.tableHeader} key={index}>
              {headerItem}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={i}>
            {dataKeys.map((key, index) => (
              <td className={styles.datacell} key={index}>
                {row[key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
