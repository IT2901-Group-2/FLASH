import StyleDictionary from "style-dictionary";
import { DesignTokens, Filter } from "style-dictionary/types";
import { formatDOCS, formatES6, transformCSS } from "./style-dictionary.formats";
import {
  allTokens,
  darkModeTokens,
  dataColorTokens,
  lightModeTokens,
  roleTokens,
  rootTokens,
} from "./tokens.config";
import { DarkTokens, LightTokens } from "./tokens/colors/color.tokens";
import { ColorRole } from "./types/output.types";
import { bundle } from "lightningcss";
import fs from "node:fs";

const OUT_DIST_DIR = "./dist/";

const bundledCSSFiles: string[] = [];

main();

async function main() {
  await buildCSSBundleForTokens({
    tokens: LightTokens,
    filename: "light-tokens.css",
    selector: ":root, :host, .light",
  });
  await buildCSSBundleForTokens({
    tokens: DarkTokens,
    filename: "dark-tokens.css",
    selector: ':root[data-theme="dark"], :host[data-theme="dark"], .dark',
  });
  await buildCSSBundleForTokens({
    tokens: lightModeTokens(false),
    filename: "semantic-light-tokens.css",
    selector: ":root, :host, .light",
    filter: async token => token.type !== "global-color",
  });
  await buildCSSBundleForTokens({
    tokens: darkModeTokens(false),
    filename: "semantic-dark-tokens.css",
    selector: ':root[data-theme="dark"], :host[data-theme="dark"], .dark',
    filter: async token => token.type !== "global-color",
  });
  await buildCSSBundleForTokens({
    tokens: roleTokens(),
    filename: "semantic-tokens.css",
    selector: ":root, :host, .light, .dark",
    filter: async token => token.type !== "global-color",
  });
  await buildCSSBundleForTokens({
    tokens: rootTokens(),
    filename: "root-tokens.css",
    selector: ":root, :host",
  });
  await buildDataColorTokens();
  await buildOtherTokenFormats();

  fs.writeFileSync(
    `${OUT_DIST_DIR}tokens.css`,
    bundledCSSFiles.map(path => `@import "${path}";`).join("\n")
  );

  const { code } = bundle({
    filename: `${OUT_DIST_DIR}tokens.css`,
    minify: false,
  });

  fs.writeFileSync(`${OUT_DIST_DIR}tokens.css`, code);

  /* Cleanup temp-files */
  bundledCSSFiles.forEach(path => {
    fs.unlinkSync(`${OUT_DIST_DIR}${path}`);
  });
}

async function buildDataColorTokens() {
  const rootSelector = `:root, [data-color=""], [data-color="primary"]`;

  const colors: ColorRole[] = [
    "neutral",
    "primary",
    "secondary",
    "accent",
    "success",
    "warning",
    "danger",
    "brand-purple",
  ] as const;

  // colors.forEach(color => {
  //   const fileName = `data-color-${color}-tokens.css`;
  //   bundledCSSFiles.push(fileName);
  //   return buildCSSBundleForTokens({
  //     tokens: dataColorTokens(color as ColorRole),
  //     filename: fileName,
  //     selector: color === "neutral" ? rootSelector : `[data-color=${color}]`,
  //     filter: async token => token.type === "data-color",
  //   });
  // });

  // I have no idea why this works and not the code above...
  for (const color of colors as ColorRole[]) {
    await buildCSSBundleForTokens({
      tokens: dataColorTokens(color),
      filename: `data-color-${color}.css`,
      selector: color === "primary" ? rootSelector : `[data-color=${color}]`,
      filter: async token => token.type === "data-color",
    });
  }
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
      [filename]: {
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
    },
  });

  await Promise.all([SDictionary.hasInitialized]);

  SDictionary.registerTransform(transformCSS);
  await SDictionary.buildAllPlatforms();
  bundledCSSFiles.push(filename);
}

async function buildOtherTokenFormats() {
  const SDictionary = new StyleDictionary({
    tokens: allTokens(),
    platforms: {
      css: {
        transformGroup: "css",
        transforms: ["name/alpha-suffix"],
        files: [
          {
            format: "css/variables",
            options: {
              outputReferences: true,
              outputReferenceFallbacks: true,
            },
          },
        ],
      },
      js: {
        transformGroup: "js",
        buildPath: OUT_DIST_DIR,
        files: [
          {
            destination: "tokens.js",
            format: "format-ES6",
          },
          {
            destination: "tokens.d.ts",
            format: "format-ES6",
          },
        ],
      },
      tokenDocs: {
        transformGroup: "js",
        buildPath: OUT_DIST_DIR,
        files: [
          {
            destination: "token_docs.js",
            format: "format-DOCS",
          },
        ],
      },
    },
  });

  await Promise.all([SDictionary.hasInitialized]);

  SDictionary.registerTransform(transformCSS);
  SDictionary.registerFormat({
    name: "format-ES6",
    format: formatES6,
  });
  SDictionary.registerFormat({
    name: "format-DOCS",
    format: formatDOCS,
  });
  await SDictionary.buildAllPlatforms();
}
