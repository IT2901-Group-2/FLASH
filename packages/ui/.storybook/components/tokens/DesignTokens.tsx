import {
  Type,
  AlignLeft,
  Maximize2,
  Monitor,
  CornerUpRight,
  Circle,
  Square,
} from "lucide-react";
import {
  BgColorPreview,
  BorderColorPreview,
  BreakpointIcon,
  FontIcon,
  RadiusPreview,
  ShadowPreview,
  TextColorPreview,
} from "./Previews";
import { stripVar, getColorCategory } from "./helpers";

export type TokenType = {
  name: string;
  value: string;
  jsValue: string;
  cssValue: string;
  type: string;
  rawType: string;
};

const categoryColors = {
  neutral: { bg: "#f1f5f9", color: "#475569" },
  accent: { bg: "#dbeafe", color: "#1d4ed8" },
  success: { bg: "#dcfce7", color: "#15803d" },
  warning: { bg: "#fef9c3", color: "#a16207" },
  danger: { bg: "#fee2e2", color: "#b91c1c" },
  "brand-purple": { bg: "#ede9fe", color: "#7c3aed" },
  base: { bg: "#f8fafc", color: "#334155" },
  focus: { bg: "#fae8ff", color: "#a21caf" },
};

const CategoryChip = ({ category }: { category: string }) => {
  const colors = categoryColors[category] || categoryColors.base;
  return (
    <span
      style={{
        background: colors.bg,
        color: colors.color,
      }}
    >
      {category}
    </span>
  );
};

function TokenTable({ tokens, renderPreview, columns }) {
  return (
    <div>
      <table>
        <tbody>
          {tokens.map((token, i) => (
            <tr key={token.jsValue + i}>
              <td>{renderPreview(token)}</td>
              <td>
                <span>{stripVar(token.cssValue)}</span>
              </td>
              {columns?.includes("category") && (
                <td>
                  <CategoryChip category={getColorCategory(token.name)} />
                </td>
              )}
              <td>
                <span>{token.jsValue}</span>
              </td>
              {columns?.includes("value") && (
                <td>
                  <span>{token.cssValue}</span>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SectionHeader({ icon, title, description }) {
  return (
    <>
      <h3>
        {icon}
        {title}
      </h3>
      {description && <p>{description}</p>}
    </>
  );
}

const DesignTokens = ({ tokens }: { tokens: TokenType[] }) => {
  const bgColors = tokens.filter(t => t.type === "color");
  const borderColors = tokens.filter(t => t.type === "border-color");
  const textColors = tokens.filter(t => t.type === "text-color");
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
      {/* ── Background Colors ── */}
      <SectionHeader
        icon={
          <Square size={20} style={{ color: "var(--text-neutral-subtle, #64748b)" }} />
        }
        title="Background Colors"
        description="Semantic background tokens for surfaces, states, and overlays."
      />
      <TokenTable
        tokens={bgColors}
        renderPreview={t => <BgColorPreview token={t} />}
        columns={["category"]}
      />

      {/* ── Border Colors ── */}
      <SectionHeader
        icon={
          <Circle size={20} style={{ color: "var(--text-neutral-subtle, #64748b)" }} />
        }
        title="Border Colors"
        description="Semantic border tokens across all semantic intents."
      />
      <TokenTable
        tokens={borderColors}
        renderPreview={t => <BorderColorPreview token={t} />}
        columns={["category"]}
      />

      {/* ── Text Colors ── */}
      <SectionHeader
        icon={<Type size={20} style={{ color: "var(--text-neutral-subtle, #64748b)" }} />}
        title="Text Colors"
        description="Foreground color tokens for text, icons, and decorative elements."
      />
      <TokenTable
        tokens={textColors}
        renderPreview={t => <TextColorPreview token={t} />}
        columns={["category"]}
      />

      {/* ── Shadows ── */}
      <SectionHeader
        icon={
          <Maximize2 size={20} style={{ color: "var(--text-neutral-subtle, #64748b)" }} />
        }
        title="Shadows"
        description="Elevation and depth tokens using CSS box-shadow."
      />
      <TokenTable tokens={shadows} renderPreview={() => <ShadowPreview />} columns={[]} />

      {/* ── Border Radii ── */}
      <SectionHeader
        icon={
          <CornerUpRight
            size={20}
            style={{ color: "var(--text-neutral-subtle, #64748b)" }}
          />
        }
        title="Border Radii"
        description="Corner radius scale for components and containers."
      />
      <TokenTable
        tokens={radii}
        renderPreview={t => <RadiusPreview token={t} />}
        columns={["value"]}
      />

      {/* ── Font Styles ── */}
      <SectionHeader
        icon={
          <AlignLeft size={20} style={{ color: "var(--text-neutral-subtle, #64748b)" }} />
        }
        title="Font Styles"
        description="Typography tokens — families, sizes, weights, and line heights."
      />
      <TokenTable
        tokens={fonts}
        renderPreview={t => <FontIcon rawType={t.rawType} />}
        columns={[]}
      />

      {/* ── Breakpoints ── */}
      <SectionHeader
        icon={
          <Monitor size={20} style={{ color: "var(--text-neutral-subtle, #64748b)" }} />
        }
        title="Breakpoints"
        description="Responsive layout breakpoints for media queries."
      />
      <TokenTable
        tokens={breakpoints}
        renderPreview={t => <BreakpointIcon rawType={t.rawType} />}
        columns={["value"]}
      />
    </div>
  );
};
export default DesignTokens;
