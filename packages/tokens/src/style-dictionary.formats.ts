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

/**
 * Formats all tokens as ES6 exports, with values resolved to their
 * final CSS variable form.
 *
 * @param dictionary The Style Dictionary dictionary containing all tokens to format.
 * @param file The Style Dictionary file configuration for the current output file.
 * @returns A string containing the formatted ES6 module with token exports.
 *
 * The output will look like:
 * ```ts
 * export const colorPrimary = "var(--color-primary)";
 * export const sizeLarge = "var(--size-large)";
 * // etc.
 * ```
 */
export const formatES6: FormatFn = async ({ dictionary, file }) => {
  const header = await fileHeader({ file });
  const tokens = dictionary.allTokens
    .map(token => `export const ${token.name} = "${createTokenValue(token)}";`)
    .join("\n");
  return `${header}${tokens}\n`;
};

/**
 * Formats all a token as either a CSS variable reference or a raw value,
 * depending on its type and name.
 *
 * @example
 * // For a token named "colorPrimary" of type "color":
 * "var(--color-primary)".
 * // For a token named "radiusSmall" of type "global-radius":
 * "small".
 * // For a token named "breakpointMobile" of type "global-breakpoint":
 * "600px".
 * // For a token named "colorPrimaryT" of type "color":
 * "var(--color-primary)".
 */
const createTokenValue = (token: TransformedToken): string => {
  const kebabName = kebabCaseForAlpha(token.name);
  if (/-t$/.test(kebabName)) return `var(--${kebabName.slice(0, -2)}T)`;

  if ((token.type as TokenTypes) === "global-radius")
    return kebabCase(token.path.join(" "));
  if ((token.type as TokenTypes) === "global-breakpoint")
    return token.value ?? token.$value;
  if ((token.type as TokenTypes) === "global-color")
    return `var(--${token.path.join("-")})`;

  return `var(--${kebabName})`;
};

/**
 * Formats the token's role based on its group. If the group does not
 * contain a dot, it checks if the group is one of "background", "text",
 * or "border" to assign a role of "root". Otherwise, it uses the part of
 * the group after the dot as the role.
 *
 * @param group The group attribute of the token, which may contain a dot to indicate hierarchy.
 * @returns A string representing the role of the token, such as "root", "color", "size", etc.
 */
const formatRole = (group: TransformedToken["group"]): string => {
  if (group?.indexOf(".") === -1) {
    if (["background", "text", "border"].includes(group)) return "root";
    return group;
  }
  return group?.split(".")[1];
};

/**
 * Custom Style Dictionary format function to export all tokens as an array of objects,
 * with values resolved to their final CSS variable form.
 *
 * @param dictionary The Style Dictionary dictionary containing all tokens to format.
 * @returns A string containing the formatted ES6 module with a single export of an array of token objects.
 *
 * The output will look like:
 * ```ts
 * export const tokens = [
 *   {
 *     name: "colorPrimary",
 *     value: "var(--color-primary)",
 *     jsValue: "colorPrimary",
 *     cssValue: "var(--color-primary)",
 *     type: "color",
 *     role: "root",
 *     rawType: "color",
 *     group: "color"
 *   },
 *   // etc.
 * ];
 * ```
 */
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
          role: formatRole(token.group),
          rawType: token.attributes?.type,
          group: token.group,
        }) + (index === dictionary.allTokens.length - 1 ? "" : ",")
      );
    })
    .join("\n");

  return `export const tokens = [${tokens}];\n`;
};
