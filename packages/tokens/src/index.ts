import StyleDictionary from "style-dictionary";
import { DesignTokens, Filter } from "style-dictionary/types";
import { transformCSS } from "./style-dictionary.formats";
import {
  lightModeTokens,
  scaleTokens,
  fontTokens,
  darkModeTokens,
} from "./tokens.config";

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
