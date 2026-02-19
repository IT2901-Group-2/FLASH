import { PlatformConfig, TransformedToken } from "style-dictionary";
import { Transform } from "style-dictionary/types";
import { kebabCaseForAlpha } from "./config/kebabCase";

export const transformCSS: Transform = {
  name: "name/alpha-suffix",
  type: "name",
  transform: (token: TransformedToken, options: PlatformConfig) =>
    kebabCaseForAlpha([options.prefix].concat(token.path).join(" ")),
};
