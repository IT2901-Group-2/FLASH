import React from "react";

export type TableData = {
  header: string[];
  data: Array<{ [key: string]: string }>;
};

export const Table = ({ header, data }: TableData) => {
  const dataKeys = data.length > 0 ? Object.keys(data[0]) : [];

  return (
    <table style={{ width: "100%", textAlign: "left" }}>
      <thead>
        <tr>
          {header.map((headerItem, index) => (
            <th key={index}>{headerItem}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
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
