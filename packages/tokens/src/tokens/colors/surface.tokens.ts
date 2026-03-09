import { ColorTheme } from "@/types/output.types";
import { StyleDictionaryToken } from "@/tokens.utils";

type SurfaceToken = StyleDictionaryToken<"color">;

const themeToken = (light: string, dark: string, theme: ColorTheme): SurfaceToken =>
  ({ value: theme === "light" ? light : dark, type: "color" });

export const surfaceTokens = (theme: ColorTheme) => ({
  color: {
    "background-base":  themeToken("#F8F2F5", "#0D0D11", theme),
    "background-dark":  themeToken("#D3CED0", "#0B0B0E", theme),
    "background-light": themeToken("#F9F3F6", "#313135", theme),

    "primary-base":  themeToken("#F2E7EA", "#1C181D", theme),
    "primary-dark":  themeToken("#CEC4C7", "#181419", theme),
    "primary-light": themeToken("#F4EBED", "#3E3B3F", theme),

    "secondary-base":  themeToken("#F8EEF1", "#29252B", theme),
    "secondary-dark":  themeToken("#D3CACD", "#231F25", theme),
    "secondary-light": themeToken("#F9F1F3", "#49464B", theme),

    // accent — dark values match light for now; update second arg when dark-mode accent is defined
    "accent-base":  themeToken("#C7A18F", "#C7A18F", theme),
    "accent-dark":  themeToken("#A9897A", "#A9897A", theme),
    "accent-light": themeToken("#CFAFA0", "#CFAFA0", theme),

    "brand-base":  themeToken("#774262", "#60344E", theme),
    "brand-dark":  themeToken("#653853", "#522C42", theme),
    "brand-light": themeToken("#8B5E7A", "#785269", theme),

    // text secondary and tertiary token values are the same now, need to update this later
    "text-base":      themeToken("#101028", "#F1F0F4", theme),
    "text-dark":      themeToken("#0E0E22", "#CDCCCE", theme),
    "text-light":     themeToken("#343448", "#F3F2F6", theme),
    "text-secondary": themeToken("#828284", "#828284", theme),
    "text-tertiary":  themeToken("#474747", "#474747", theme),

    "border-base":  themeToken("#C9BDC0", "#272529", theme),
    "border-dark":  themeToken("#ABA1A3", "#211F23", theme),
    "border-light": themeToken("#D1C7C9", "#474649", theme),

    // status tokens — theme-invariant; update second args when dark-mode values are decided
    "destructive-base":  themeToken("#e22948", "#e22948", theme),
    "destructive-dark":  themeToken("#c0233d", "#c0233d", theme),
    "destructive-light": themeToken("#e64963", "#e64963", theme),

    "success-base":  themeToken("#3d9751", "#3d9751", theme),
    "success-dark":  themeToken("#348045", "#348045", theme),
    "success-light": themeToken("#5aa76b", "#5aa76b", theme),

    "warning-base":  themeToken("#F6BA53", "#F6BA53", theme),
    "warning-dark":  themeToken("#d19e47", "#d19e47", theme),
    "warning-light": themeToken("#f7c46d", "#f7c46d", theme),

    backdrop: themeToken("#474747FC", "#242424FC", theme),
  },
});
