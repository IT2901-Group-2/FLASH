import StyleDictionary from "style-dictionary";
import { DesignTokens, Filter } from "style-dictionary/types";
import { transformCSS } from "./style-dictionary.formats";
import { allTokens, lightModeTokens } from "./tokens.config";

const OUT_DIST_DIR = "./dist/";

const bundledCSSFiles: string[] = [];

main();

async function main() {
  await buildCSSBundleForTokens({
    tokens: lightModeTokens(false),
    filename: "semantic-light-tokens.css",
    selector: ":root, :host, .light",
  });
  await buildCSSBundleForTokens({
    tokens: allTokens(),
    filename: "scale-tokens.css",
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
