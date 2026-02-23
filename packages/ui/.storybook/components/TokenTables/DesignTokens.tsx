import {
  BgColorPreview,
  BorderColorPreview,
  BreakpointIcon,
  FontIcon,
  RadiusPreview,
  ShadowPreview,
  TextColorPreview,
} from "./Previews";
import { DisplayTable } from "./DisplayTable";
import { Button } from "storybook/internal/components";
import { useState } from "react";

export type TokenType = {
  name: string;
  value: string;
  jsValue: string;
  cssValue: string;
  type: string;
  rawType: string;
};

function SectionHeader({ title, description }: { title: string; description: string }) {
  return (
    <>
      <h3>{title}</h3>
      {description && <p>{description}</p>}
    </>
  );
}

const switchTheme = () => {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  document.documentElement.setAttribute(
    "data-theme",
    currentTheme === "light" ? "dark" : "light"
  );
};

const DesignTokens = ({ tokens }: { tokens: TokenType[] }) => {
  // Set theme to light as default
  document.documentElement.setAttribute("data-theme", "light");

  const bgColors = tokens.filter(
    t => t.type === "color" && !t.name.includes("border") && !t.name.includes("text")
  );
  const borderColors = tokens.filter(t => t.name.includes("border"));
  const textColors = tokens.filter(t => t.name.includes("text"));
  const shadows = tokens.filter(t => t.type === "shadow");
  const radii = tokens.filter(t => t.type === "global-radius");
  const fonts = tokens.filter(t => t.type === "global-font");
  const breakpoints = tokens.filter(t => t.type === "global-breakpoint");

  return (
    <div
      style={{
        fontFamily: "system-ui, -apple-system, sans-serif",
        maxWidth: 900,
        margin: "0 auto",
        padding: "0 0 64px",
      }}
    >
      <Button onClick={switchTheme}>Switch Theme</Button>

      {/* ── Background Colors ── */}
      <SectionHeader
        title="Background Colors"
        description="Semantic background tokens for surfaces, states, and overlays."
      />
      <DisplayTable tokens={bgColors} renderPreview={t => <BgColorPreview token={t} />} />

      {/* ── Border Colors ── */}
      <SectionHeader
        title="Border Colors"
        description="Semantic border tokens across all semantic intents."
      />
      <DisplayTable
        tokens={borderColors}
        renderPreview={t => <BorderColorPreview token={t} />}
      />

      {/* ── Text Colors ── */}
      <SectionHeader
        title="Text Colors"
        description="Foreground color tokens for text, icons, and decorative elements."
      />
      <DisplayTable
        tokens={textColors}
        renderPreview={t => <TextColorPreview token={t} />}
      />

      {/* ── Shadows ── */}
      <SectionHeader
        title="Shadows"
        description="Elevation and depth tokens using CSS box-shadow."
      />
      <DisplayTable tokens={shadows} renderPreview={() => <ShadowPreview />} />

      {/* ── Border Radii ── */}
      <SectionHeader
        title="Border Radii"
        description="Corner radius scale for components and containers."
      />
      <DisplayTable tokens={radii} renderPreview={t => <RadiusPreview token={t} />} />

      {/* ── Font Styles ── */}
      <SectionHeader
        title="Font Styles"
        description="Typography tokens — families, sizes, weights, and line heights."
      />
      <DisplayTable
        tokens={fonts}
        renderPreview={t => <FontIcon rawType={t.rawType} />}
      />

      {/* ── Breakpoints ── */}
      <SectionHeader
        title="Breakpoints"
        description="Responsive layout breakpoints for media queries."
      />
      <DisplayTable
        tokens={breakpoints}
        renderPreview={t => <BreakpointIcon rawType={t.rawType} />}
      />
    </div>
  );
};
export default DesignTokens;
