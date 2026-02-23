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

const createTokenValue = (token: TransformedToken): string => {
  const kebabName = kebabCaseForAlpha(token.name);
  if ((token.type as TokenTypes) === "global-breakpoint")
    return token.value ?? token.$value;
  if ((token.type as TokenTypes) === "global-color")
    return `var(--${token.path.join("-")})`;

  return `var(--${kebabName})`;
};

const formatRole = (group: TransformedToken["group"]): string => {
  if (group?.indexOf(".") === -1) {
    if (["background", "text", "border"].includes(group)) return "root";
    return group;
  }
  return group?.split(".")[1];
};

export const formatDOCS: FormatFn = async ({ dictionary }) => {
  const ignoredTokenTypes = ["global-color", "opacity"];

  const tokens = dictionary.allTokens
    .filter(token => token.type && !ignoredTokenTypes.includes(token.type))
    .filter(token => !token.docsIgnore)
    .map((token, index) => {
      const name = kebabCaseForAlpha(token.name);
      return (
        JSON.stringify({
          name,
          value: createTokenValue(token),
          jsValue: token.name,
          cssValue: createTokenValue(token),
          type: token.type,
          rawType: token.attributes?.type,
          group: token.group,
        }) + (index === dictionary.allTokens.length - 1 ? "" : ",")
      );
    })
    .join("\n");

  return `export const tokens = [${tokens}];\n`;
};
