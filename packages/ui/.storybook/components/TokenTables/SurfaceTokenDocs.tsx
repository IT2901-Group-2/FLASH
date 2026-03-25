import CopyButton from "@docs-components/CopyButton/CopyButton";
import styles from "../Table.module.css";

type SurfaceTokenRow = {
  cssVar: string;
  variant: string;
  lightHex: string;
  darkHex: string;
};

type ConceptGroup = {
  concept: string;
  description: string;
  tokens: SurfaceTokenRow[];
};

const CONCEPT_GROUPS: ConceptGroup[] = [
  {
    concept: "background",
    description: "Page shell and canvas. The outermost layer every user sees.",
    tokens: [
      { cssVar: "--color-background-base", variant: "base", lightHex: "#F8F2F5", darkHex: "#0D0D11" },
      { cssVar: "--color-background-dark", variant: "dark", lightHex: "#f0eaed", darkHex: "#09090C" },
      { cssVar: "--color-background-light", variant: "light", lightHex: "#F9F5F7", darkHex: "#111115" },
    ],
  },
  {
    concept: "primary",
    description: "First elevated surface — cards, panels, and containers that sit above the page shell.",
    tokens: [
      { cssVar: "--color-primary-base", variant: "base", lightHex: "#F2E7EA", darkHex: "#1C181D" },
      { cssVar: "--color-primary-dark", variant: "dark", lightHex: "#DAD0D3", darkHex: "#181419" },
      { cssVar: "--color-primary-light", variant: "light", lightHex: "#f6eef0", darkHex: "#221e23" },
    ],
  },
  {
    concept: "secondary",
    description: "Nested surfaces — sidebars, inner panels, and surfaces nested inside a primary surface.",
    tokens: [
      { cssVar: "--color-secondary-base", variant: "base", lightHex: "#F8EEF1", darkHex: "#29252B" },
      { cssVar: "--color-secondary-dark", variant: "dark", lightHex: "#F2E8EB", darkHex: "#19161A" },
      { cssVar: "--color-secondary-light", variant: "light", lightHex: "#F9F1F3", darkHex: "#1f1b20" },
    ],
  },
  {
    concept: "accent",
    description: "Warm sand/terracotta accent for highlights, badges, and decorative elements.",
    tokens: [
      { cssVar: "--color-accent-base", variant: "base", lightHex: "#C7A18F", darkHex: "#8A6654" },
      { cssVar: "--color-accent-dark", variant: "dark", lightHex: "#BD9988", darkHex: "#8a6654" },
      { cssVar: "--color-accent-light", variant: "light", lightHex: "#CAA695", darkHex: "#8d6a58" },
    ],
  },
  {
    concept: "brand",
    description: "Brand purple — primary actions, buttons, and interactive highlights.",
    tokens: [
      { cssVar: "--color-brand-base", variant: "base", lightHex: "#774262", darkHex: "#60344E" },
      { cssVar: "--color-brand-dark", variant: "dark", lightHex: "#6B3B58", darkHex: "#593048" },
      { cssVar: "--color-brand-light", variant: "light", lightHex: "#7a4766", darkHex: "#643952" },
    ],
  },
  {
    concept: "text",
    description: "Foreground text. base/dark/light for hierarchy; secondary and tertiary for muted labels.",
    tokens: [
      { cssVar: "--color-text-base", variant: "base", lightHex: "#101028", darkHex: "#F1F0F4" },
      { cssVar: "--color-text-dark", variant: "dark", lightHex: "#0E0E22", darkHex: "#CDCCCE" },
      { cssVar: "--color-text-light", variant: "light", lightHex: "#343448", darkHex: "#F3F2F6" },
      { cssVar: "--color-text-secondary", variant: "secondary", lightHex: "#828284", darkHex: "#8F8F90" },
      { cssVar: "--color-text-tertiary", variant: "tertiary", lightHex: "#474747", darkHex: "#C7C7C8" },
    ],
  },
  {
    concept: "border",
    description: "Dividers and outlines that separate surfaces and define component boundaries.",
    tokens: [
      { cssVar: "--color-border-base", variant: "base", lightHex: "#C9BDC0", darkHex: "#272529" },
      { cssVar: "--color-border-dark", variant: "dark", lightHex: "#797173", darkHex: "#1b1a1d" },
      { cssVar: "--color-border-light", variant: "light", lightHex: "#D9D1D3", darkHex: "#3D3B3E" },
    ],
  },
  {
    concept: "destructive",
    description: "Error states, delete actions, and other irreversible or dangerous interactions.",
    tokens: [
      { cssVar: "--color-destructive-base", variant: "base", lightHex: "#e22948", darkHex: "#e22948" },
      { cssVar: "--color-destructive-dark", variant: "dark", lightHex: "#c0233d", darkHex: "#c0233d" },
      { cssVar: "--color-destructive-light", variant: "light", lightHex: "#e64963", darkHex: "#e64963" },
    ],
  },
  {
    concept: "success",
    description: "Confirmation and positive feedback states.",
    tokens: [
      { cssVar: "--color-success-base", variant: "base", lightHex: "#3d9751", darkHex: "#3d9751" },
      { cssVar: "--color-success-dark", variant: "dark", lightHex: "#348045", darkHex: "#348045" },
      { cssVar: "--color-success-light", variant: "light", lightHex: "#5aa76b", darkHex: "#5aa76b" },
    ],
  },
  {
    concept: "warning",
    description: "Caution states — non-destructive alerts and advisory messages.",
    tokens: [
      { cssVar: "--color-warning-base", variant: "base", lightHex: "#F6BA53", darkHex: "#F6BA53" },
      { cssVar: "--color-warning-dark", variant: "dark", lightHex: "#d19e47", darkHex: "#d19e47" },
      { cssVar: "--color-warning-light", variant: "light", lightHex: "#f7c46d", darkHex: "#f7c46d" },
    ],
  },
  {
    concept: "backdrop",
    description: "Modal overlay scrim. No variants — one theme-aware value. Always use --color-backdrop without a suffix.",
    tokens: [
      { cssVar: "--color-backdrop", variant: "(none)", lightHex: "#474747FC", darkHex: "#242424FC" },
    ],
  },
];

function Swatch({ hex }: { hex: string }) {
  return (
    <div
      title={hex}
      style={{
        width: 120,
        height: 80,
        borderRadius: 8,
        backgroundColor: hex,
        border: "1px solid rgba(0,0,0,0.12)",
        flexShrink: 0,
      }}
    />
  );
}

export default function SurfaceTokenDocs() {
  return (
    <div
      style={{
        fontFamily: "system-ui, -apple-system, sans-serif",
        maxWidth: 900,
        margin: "0 auto",
        padding: "0 0 64px",
      }}
    >
      {CONCEPT_GROUPS.map(group => (
        <section key={group.concept} style={{ marginTop: 40 }}>
          <h3 style={{ textTransform: "capitalize", marginBottom: 4 }}>{group.concept}</h3>
          <p style={{ marginTop: 0, marginBottom: 12, opacity: 0.75, fontSize: 14 }}>
            {group.description}
          </p>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Lightmode</th>
                <th>Darkmode</th>
                <th>CSS Variable</th>
                <th>Variant</th>
              </tr>
            </thead>
            <tbody>
              {group.tokens.map(token => (
                <tr key={token.cssVar}>
                  <td>
                    <Swatch hex={token.lightHex} />
                  </td>
                  <td>
                    <Swatch hex={token.darkHex} />
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <code style={{ fontSize: 13 }}>{token.cssVar}</code>
                      <CopyButton copyValue={token.cssVar} />
                    </div>
                  </td>
                  <td>
                    <code style={{ fontSize: 13 }}>{token.variant}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}
    </div>
  );
}
