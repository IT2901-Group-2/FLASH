import { TokenType } from "./DesignTokens";
import { Type, Monitor, Tablet, Smartphone, UnfoldVertical } from "lucide-react";
import "@flash/tokens/js";
import { BorderNeutralStrong, RadiusFull } from "@flash/tokens/js";

export const BgColorPreview = ({ token }: { token: TokenType }) => (
  <div
    style={{
      padding: 8,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      border: `1px solid ${BorderNeutralStrong}`,
      borderRadius: 8,
      maxWidth: "min-content",
    }}
  >
    <div
      style={{
        width: 24,
        height: 24,
        borderRadius: RadiusFull,
        background: token.cssValue,
        border: `1px solid ${BorderNeutralStrong}`,
        flexShrink: 0,
      }}
    />
  </div>
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
        background: "var(--bg-neutral-moderate, #dbeafe)",
        border: "1.5px solid var(--border-neutral, #93c5fd)",
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
        style={{ color: "var(--text-neutral-strong, #64748b)", flexShrink: 0 }}
      />
    );
  if (rawType === "md" || rawType === "md-down")
    return (
      <Tablet
        size={20}
        strokeWidth={1.5}
        style={{ color: "var(--text-neutral-strong, #64748b)", flexShrink: 0 }}
      />
    );
  return (
    <Monitor
      size={20}
      strokeWidth={1.5}
      style={{ color: "var(--text-neutral-strong, #64748b)", flexShrink: 0 }}
    />
  );
};

export const FontIcon = ({ rawType }: { rawType: string }) => {
  if (rawType === "family")
    return (
      <Type
        size={18}
        strokeWidth={1.5}
        style={{ color: "var(--text-neutral-strong, #64748b)", flexShrink: 0 }}
      />
    );
  if (rawType.startsWith("weight-bold"))
    return (
      <span
        style={{
          fontSize: 18,
          lineHeight: 1,
          flexShrink: 0,
          fontWeight: `var(--font-weight-bold)`,
        }}
      >
        Aa
      </span>
    );
  if (rawType.startsWith("weight"))
    return (
      <span
        style={{
          fontSize: 18,
          lineHeight: 1,
          flexShrink: 0,
          fontWeight: `var(--font-weight-regular)`,
        }}
      >
        Aa
      </span>
    );
  if (rawType.startsWith("line-height"))
    return (
      <UnfoldVertical
        size={18}
        strokeWidth={1.5}
        style={{ color: "var(--text-neutral-strong, #64748b)", flexShrink: 0 }}
      />
    );
  if (rawType.startsWith("size"))
    return (
      <span
        style={{
          fontSize: `var(--font-${rawType})`,
          lineHeight: 1,
          flexShrink: 0,
        }}
      >
        Aa
      </span>
    );
  return (
    <Type
      size={18}
      strokeWidth={1.5}
      style={{ color: "var(--text-neutral-strong, #64748b)", flexShrink: 0 }}
    />
  );
};
