import { PlatformConfig, TransformedToken } from "style-dictionary";
import { FormatFn, Transform } from "style-dictionary/types";
import { kebabCase, kebabCaseForAlpha } from "./utils/kebabCase";
import { fileHeader } from "style-dictionary/utils";
import { TokenTypes } from "./tokens.utils";

export const transformCSS: Transform = {
  name: "name/alpha-suffix",
  type: "name",
  transform: (token: TransformedToken, options: PlatformConfig) =>
    kebabCase([options.prefix].concat(token.path).join(" ")),
};

export const formatES6: FormatFn = async ({ dictionary, file }) => {
  const header = await fileHeader({ file });
  const tokens = dictionary.allTokens
    .map(token => `export const ${token.name} = "${createTokenValue(token)}";`)
    .join("\n");
  return `${header}${tokens}\n`;
};

function createTokenValue(token: TransformedToken): string {
  const kebabName = kebabCaseForAlpha(token.name);
  if ((token.type as TokenTypes) === "global-breakpoint")
    return token.value ?? token.$value;
  if ((token.type as TokenTypes) === "global-color")
    return `var(--${token.path.join("-")})`;

  return `var(--${kebabName})`;
}
