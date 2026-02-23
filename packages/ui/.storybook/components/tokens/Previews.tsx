import { TokenType } from "./DesignTokens";
import { Type, AlignLeft, Monitor, Tablet, Smartphone, Bold, Minus } from "lucide-react";

export const BgColorPreview = ({ token }: { token: TokenType }) => (
  <div
    style={{
      width: 32,
      height: 32,
      borderRadius: 6,
      background: token.cssValue,
      border: "1px solid rgba(0,0,0,0.08)",
      flexShrink: 0,
    }}
  />
);

export const BorderColorPreview = ({ token }: { token: TokenType }) => (
  <div
    style={{
      width: 28,
      height: 28,
      borderRadius: "50%",
      border: `2.5px solid ${token.cssValue}`,
      flexShrink: 0,
      background: "transparent",
    }}
  />
);

export const TextColorPreview = ({ token }: { token: TokenType }) => (
  <span
    style={{
      color: token.cssValue,
      fontWeight: 700,
      fontSize: 18,
      lineHeight: 1,
      fontFamily: "Georgia, serif",
      flexShrink: 0,
    }}
  >
    Aa
  </span>
);

export const ShadowPreview = () => (
  <div
    style={{
      width: 32,
      height: 32,
      borderRadius: 6,
      background: "#fff",
      boxShadow: "var(--shadow-dialog, 0 8px 32px rgba(0,0,0,0.18))",
      flexShrink: 0,
    }}
  />
);

export const RadiusPreview = ({ token }: { token: TokenType }) => {
  const r = token.rawType === "full" ? "9999px" : `${token.rawType}px`;
  return (
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: r,
        background: "var(--bg-accent-moderate, #dbeafe)",
        border: "1.5px solid var(--border-accent, #93c5fd)",
        flexShrink: 0,
      }}
    />
  );
};

export const BreakpointIcon = ({ rawType }: { rawType: string }) => {
  if (rawType === "xs" || rawType === "sm" || rawType === "sm-down")
    return (
      <Smartphone
        size={20}
        strokeWidth={1.5}
        style={{ color: "var(--text-neutral-subtle, #64748b)", flexShrink: 0 }}
      />
    );
  if (rawType === "md" || rawType === "md-down")
    return (
      <Tablet
        size={20}
        strokeWidth={1.5}
        style={{ color: "var(--text-neutral-subtle, #64748b)", flexShrink: 0 }}
      />
    );
  return (
    <Monitor
      size={20}
      strokeWidth={1.5}
      style={{ color: "var(--text-neutral-subtle, #64748b)", flexShrink: 0 }}
    />
  );
};

export const FontIcon = ({ rawType }: { rawType: string }) => {
  if (rawType === "family")
    return (
      <AlignLeft
        size={18}
        strokeWidth={1.5}
        style={{ color: "var(--text-neutral-subtle, #64748b)", flexShrink: 0 }}
      />
    );
  if (rawType.startsWith("weight-bold"))
    return (
      <Bold
        size={18}
        strokeWidth={1.5}
        style={{ color: "var(--text-neutral-subtle, #64748b)", flexShrink: 0 }}
      />
    );
  if (rawType.startsWith("weight"))
    return (
      <Type
        size={18}
        strokeWidth={1.5}
        style={{ color: "var(--text-neutral-subtle, #64748b)", flexShrink: 0 }}
      />
    );
  if (rawType.startsWith("line-height"))
    return (
      <Minus
        size={18}
        strokeWidth={1.5}
        style={{ color: "var(--text-neutral-subtle, #64748b)", flexShrink: 0 }}
      />
    );
  if (rawType.startsWith("size"))
    return (
      <Type
        size={18}
        strokeWidth={1.5}
        style={{ color: "var(--text-neutral-subtle, #64748b)", flexShrink: 0 }}
      />
    );
  return (
    <Type
      size={18}
      strokeWidth={1.5}
      style={{ color: "var(--text-neutral-subtle, #64748b)", flexShrink: 0 }}
    />
  );
};
