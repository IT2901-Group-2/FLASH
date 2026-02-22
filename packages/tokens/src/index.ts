import StyleDictionary from "style-dictionary";
import { DesignTokens, Filter } from "style-dictionary/types";
import { formatES6, transformCSS } from "./style-dictionary.formats";
import {
  lightModeTokens,
  scaleTokens,
  fontTokens,
  darkModeTokens,
} from "./tokens.config";
import fs from "node:fs";
import { bundle } from "lightningcss";

const OUT_DIST_DIR = "./dist/";

const bundledCSSFiles: string[] = [];

main();

async function main() {
  await buildCSSBundleForTokens({
    tokens: lightModeTokens(true),
    filename: "light-tokens.css",
    selector: ":root, :host, .light",
  });
  await buildCSSBundleForTokens({
    tokens: darkModeTokens(true),
    filename: "dark-tokens.css",
    selector: ':root[data-theme="dark"], :host[data-theme="dark"], .dark',
  });
  await buildCSSBundleForTokens({
    tokens: scaleTokens(),
    filename: "scale-tokens.css",
    selector: ":root, :host",
  });
  await buildCSSBundleForTokens({
    tokens: fontTokens(),
    filename: "font-tokens.css",
    selector: ":root, :host",
  });

  fs.writeFileSync(
    `${OUT_DIST_DIR}tokens.css`,
    bundledCSSFiles.map(path => `@import "${path}";`).join("\n")
  );
  const { code } = bundle({
    filename: `${OUT_DIST_DIR}tokens.css`,
    minify: false,
  });
  fs.writeFileSync(`${OUT_DIST_DIR}tokens.css`, code);
  bundledCSSFiles.forEach(path => {
    fs.unlinkSync(`${OUT_DIST_DIR}${path}`);
  });
}

async function buildCSSBundleForTokens({
  tokens,
  filename,
  selector,
  filter,
}: {
  filename: string;
  selector: string;
  tokens: DesignTokens;
  filter?: Filter["filter"];
}) {
  const SDictionary = new StyleDictionary({
    tokens,
    log: { warnings: "disabled" },
    platforms: {
      css: {
        transformGroup: "css",
        transforms: ["name/alpha-suffix"],
        buildPath: OUT_DIST_DIR,
        files: [
          {
            destination: filename,
            format: "css/variables",
            ...(filter && { filter }),
            options: {
              outputReferences: true,
              selector,
            },
          },
        ],
      },
      js: {
        transformGroup: "js",
        buildPath: OUT_DIST_DIR,
        files: [
          {
            destination: "tokens.d.ts",
            format: "format-ES6",
          },
        ],
      },
    },
  });

  await Promise.all([SDictionary.hasInitialized]);

  SDictionary.registerTransform(transformCSS);
  SDictionary.registerFormat({ name: "format-ES6", format: formatES6 });
  await SDictionary.buildAllPlatforms();
  bundledCSSFiles.push(filename);
}
