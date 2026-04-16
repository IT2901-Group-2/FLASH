import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ModTag from "./ModTag";

describe("ModTag", () => {
  describe("render", () => {
    it("always renders the ChevronRight icon", () => {
      const { container } = render(<ModTag isMod={false} />);
      const svgs = container.querySelectorAll("svg");
      expect(svgs.length).toBeGreaterThanOrEqual(1);
    });

    it("renders with 'mod' when 'isMod' is true", () => {
      const { container } = render(<ModTag isMod={true} />);
      expect(container).toHaveTextContent("Mod");

      const svgs = container.querySelectorAll("svg");
      expect(svgs).toHaveLength(2);
    });

    it("renders without 'mod' when 'isMod' is false", () => {
      const { container } = render(<ModTag isMod={false} />);
      expect(container).not.toHaveTextContent("Mod");

      const svgs = container.querySelectorAll("svg");
      expect(svgs).toHaveLength(1);
    });
  });

  describe("passthrough props", () => {
    it("forwards className to the outer span", () => {
      const { container } = render(<ModTag isMod={false} className="custom-class" />);
      expect(container.firstChild).toHaveClass("custom-class");
    });

    it("forwards data attributes to the outer span", () => {
      const { container } = render(<ModTag isMod={false} data-testid="mod-tag" />);
      expect(container.firstChild).toHaveAttribute("data-testid", "mod-tag");
    });

    it("forwards onClick handler to the outer span", () => {
      const onClick = vi.fn();
      const { container } = render(<ModTag isMod={false} onClick={onClick} />);
      (container.firstChild as HTMLElement).click();
      expect(onClick).toHaveBeenCalledOnce();
    });

    it("forwards aria-label to the outer span", () => {
      const { container } = render(<ModTag isMod={true} aria-label="moderation tag" />);
      expect(container.firstChild).toHaveAttribute("aria-label", "moderation tag");
    });
  });
});
