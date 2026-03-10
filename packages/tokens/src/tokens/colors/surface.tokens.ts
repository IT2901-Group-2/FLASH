import { ColorTheme } from "@/types/output.types";
import { StyleDictionaryToken } from "@/tokens.utils";

type SurfaceToken = StyleDictionaryToken<"color">;

const themeToken = (light: string, dark: string, theme: ColorTheme): SurfaceToken =>
  ({ value: theme === "light" ? light : dark, type: "color" });

export const surfaceTokens = (theme: ColorTheme) => ({
  color: {
    "background-base":  themeToken("#F8F2F5", "#0D0D11", theme),
    "background-dark":  themeToken("#f0eaed", "#09090C", theme),
    "background-light": themeToken("#F9F5F7", "#111115", theme),

    "primary-base":  themeToken("#F2E7EA", "#1C181D", theme),
    "primary-dark":  themeToken("#DAD0D3", "#181419", theme),
    "primary-light": themeToken("#f6eef0", "#221e23", theme),
    
    "secondary-base":  themeToken("#F8EEF1", "#29252B", theme),
    "secondary-dark":  themeToken("#F2E8EB", "#19161A", theme),
    "secondary-light": themeToken("#F9F1F3", "#1f1b20", theme),

    "accent-base":  themeToken("#C7A18F", "#8A6654", theme),
    "accent-dark":  themeToken("#BD9988", "#8a6654", theme),
    "accent-light": themeToken("#CAA695", "#8d6a58", theme),

    "brand-base":  themeToken("#774262", "#60344E", theme),
    "brand-dark":  themeToken("#6B3B58", "#593048", theme),
    "brand-light": themeToken("#7a4766", "#643952", theme),

    "text-base":      themeToken("#101028", "#F1F0F4", theme),
    "text-dark":      themeToken("#0E0E22", "#CDCCCE", theme),
    "text-light":     themeToken("#343448", "#F3F2F6", theme),
    "text-secondary": themeToken("#828284", "#8F8F90", theme),
    "text-tertiary":  themeToken("#474747", "#C7C7C8", theme),

    "border-base":  themeToken("#C9BDC0", "#272529", theme),
    "border-dark":  themeToken("#797173", "#1b1a1d", theme),
    "border-light": themeToken("#D9D1D3", "#3D3B3E", theme),

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
