import { PlatformConfig, TransformedToken } from "style-dictionary";
import { Transform } from "style-dictionary/types";
import { kebabCase } from "./config/kebabCase";

export const transformCSS: Transform = {
  name: "name/alpha-suffix",
  type: "name",
  transform: (token: TransformedToken, options: PlatformConfig) =>
    kebabCase([options.prefix].concat(token.path).join(" ")),
};
