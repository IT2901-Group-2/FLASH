/**
 * Resolves CSS variable expressions like `var(--token, fallback)` into concrete
 * color values using computed styles from `:root`.
 *
 * This makes exported SVGs portable across viewers that do not understand the
 * app's runtime CSS variables.
 */
const resolveCssVarsInString = (value: string): string => {
  const cssVarPattern = /var\((--[^,\s)]+)(?:,\s*([^)]+))?\)/g;

  return value.replace(
    cssVarPattern,
    (match, variableName: string, fallback?: string) => {
      const resolved = getComputedStyle(document.documentElement)
        .getPropertyValue(variableName)
        .trim();

      if (resolved) return resolved;
      return fallback?.trim() ?? match;
    }
  );
};

/**
 * Downloads a rendered QR SVG as a standalone `.svg` file.
 *
 * Steps performed before download:
 * 1) Clone the original SVG so the DOM UI is never mutated.
 * 2) Ensure `xmlns` is present for SVG viewer compatibility.
 * 3) Resolve CSS variables in `fill`, `stroke`, and `style`.
 * 4) Inject an explicit background rectangle for portability.
 * 5) Serialize and download through a temporary object URL.
 *
 * @param svg The SVG element containing the QR code to download.
 * @param fileName The desired name of the downloaded SVG file (e.g., "qr-code.svg").
 *
 * @example
 * const svgElement = document.getElementById("my-qr-code") as SVGSVGElement;
 * downloadQrSvg(svgElement, "my-qr-code.svg");
 */
export const downloadQrSvg = (svg: SVGSVGElement, fileName: string) => {
  // Work on a detached clone so the on-screen QR stays untouched.
  const cloned = svg.cloneNode(true) as SVGSVGElement;

  // Ensure a valid SVG namespace so external viewers can parse the file.
  if (!cloned.getAttribute("xmlns")) {
    cloned.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  }

  // Resolve CSS variables on the root and all descendants.
  const nodes: SVGElement[] = [
    cloned,
    ...Array.from(cloned.querySelectorAll<SVGElement>("*")),
  ];

  for (const node of nodes) {
    for (const attr of ["fill", "stroke", "style"] as const) {
      const v = node.getAttribute(attr);
      if (v && v.includes("var(")) {
        node.setAttribute(attr, resolveCssVarsInString(v));
      }
    }
  }

  // Add a background so transparent areas are stable in all viewers/apps.
  const bg = resolveCssVarsInString("var(--color-neutral-000, #ffffff)");
  const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  rect.setAttribute("x", "0");
  rect.setAttribute("y", "0");
  rect.setAttribute("width", "100%");
  rect.setAttribute("height", "100%");
  rect.setAttribute("fill", bg);
  cloned.insertBefore(rect, cloned.firstChild);

  // Serialize the SVG markup into a downloadable Blob.
  const serializer = new XMLSerializer();
  const source = serializer.serializeToString(cloned);

  const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  // Trigger download using a temporary anchor element.
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();

  // Release memory tied to the object URL.
  URL.revokeObjectURL(url);
};
