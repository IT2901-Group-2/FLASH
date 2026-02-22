import { bundle } from "lightningcss";
import fs from "node:fs";

export const combineFiles = (files: string[], outDir: string) => {
  fs.writeFileSync(
    `${outDir}tokens.css`,
    files.map(path => `@import "${path}";`).join("\n")
  );
  const { code } = bundle({
    filename: `${outDir}tokens.css`,
    minify: false,
  });
  fs.writeFileSync(`${outDir}tokens.css`, code);
  files.forEach(path => {
    fs.unlinkSync(`${outDir}${path}`);
  });
};
