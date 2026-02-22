import { bundle } from "lightningcss";
import fs from "node:fs";

/**
 * Combines multiple files into a single file by creating an import file and then bundling it.
 *
 * @param files - Array of file paths to combine
 * @param outputFile - Output directory for the combined file
 * @param path - Path to the files
 */
export const combineFiles = (files: string[], outputFile: string, path?: string) => {
  const outPath = path ? `${path}${outputFile}` : outputFile;
  const dir = path ?? "./";

  fs.writeFileSync(outPath, files.map(file => `@import "./${file}";`).join("\n"));
  const { code } = bundle({
    filename: outPath,
    minify: false,
  });
  fs.writeFileSync(outPath, code);
  files.forEach(file => {
    fs.unlinkSync(`${dir}${file}`);
  });
};
