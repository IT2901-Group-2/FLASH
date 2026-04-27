import { describe, it, expect } from "vitest";
import { downloadQrSvg } from "./downloadqrcode";

const makeSvg = (innerHTML = ""): SVGSVGElement => {
  const svg = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg"
  ) as SVGSVGElement;
  svg.innerHTML = innerHTML;
  return svg;
};

//const attrs = (el: Element): Record<string, string> =>
//  Object.fromEntries(Array.from(el.attributes).map(a => [a.name, a.value]));

describe("downloadQrSvg", () => {
  describe("SVG cloning - original is never mutated", () => {
    it("does not modify the original SVG element", () => {
      const svg = makeSvg("<rect fill='var(--color-primary)' />");
      const originalHtml = svg.innerHTML;
      downloadQrSvg(svg, "qr.svg");
      expect(svg.innerHTML).toBe(originalHtml);
    });

    it("does not add xmlns to the original element", () => {
      const svg = makeSvg();
      downloadQrSvg(svg, "qr.svg");
      expect(svg.getAttribute("xmlns")).toBeNull();
    });
  });
});
