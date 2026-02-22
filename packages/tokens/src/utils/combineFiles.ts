import { bundle } from "lightningcss";
import fs from "node:fs";

/**
 * Combines multiple files into a single file by creating an import file and then bundling it.
 *
 * @param files - Array of file paths to combine
 * @param outDir - Output directory for the combined file
 */
export const combineFiles = (files: string[], outPath: string) => {
  fs.writeFileSync(outPath, files.map(path => `@import "${path}";`).join("\n"));
  const { code } = bundle({
    filename: outPath,
    minify: false,
  });
  fs.writeFileSync(outPath, code);
  files.forEach(path => {
    fs.unlinkSync(`${outPath}${path}`);
  });
};
