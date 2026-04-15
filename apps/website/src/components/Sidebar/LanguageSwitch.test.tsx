import { languageHookMock, mockLanguageReady } from "@test-config";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import LanguageSwitch from "./LanguageSwitch";
import { useLanguage } from "@/hooks/useLanguage";

vi.mock("@/hooks/useLanguage", () => languageHookMock());

describe("LanguageSwitch (in sidebar)", () => {
  describe("guard: wrong number of locales", () => {
    it("throws when given fewer than 2 locales", () => {
      vi.mocked(useLanguage).mockReturnValue(mockLanguageReady({ locales: ["en"] }));
      expect(() => render(<LanguageSwitch />)).toThrow(RangeError);
    });

    it("throws when given more than 2 locales", () => {
      vi.mocked(useLanguage).mockReturnValue(
        mockLanguageReady({ locales: ["en", "no", "fr"] })
      );
      expect(() => render(<LanguageSwitch />)).toThrow(RangeError);
    });

    it("throws when given zero locales", () => {
      vi.mocked(useLanguage).mockReturnValue(
        mockLanguageReady({ locales: [], currentLocale: "" })
      );
      expect(() => render(<LanguageSwitch />)).toThrow(RangeError);
    });
  });

  describe("rendering", () => {
    beforeEach(() => {
      vi.mocked(useLanguage).mockReturnValue(mockLanguageReady());
    });

    it("renders all locale labels in uppercase", () => {
      render(<LanguageSwitch />);
      expect(screen.getByText("EN")).toBeInTheDocument();
      expect(screen.getByText("NO")).toBeInTheDocument();
    });
  });

  describe("lang-index attribute", () => {
    it("sets lang-index to 0 when currentLocale is the first locale", () => {
      vi.mocked(useLanguage).mockReturnValue(mockLanguageReady());
      const { container } = render(<LanguageSwitch />);
      expect(container.firstChild).toHaveAttribute("lang-index", "0");
    });

    it("sets lang-index to 1 when currentLocale is the second locale", () => {
      vi.mocked(useLanguage).mockReturnValue(
        mockLanguageReady({ locales: ["no", "en"] }) // Switch order to make "en" the second locale
      );
      const { container } = render(<LanguageSwitch />);
      expect(container.firstChild).toHaveAttribute("lang-index", "1");
    });
  });

  describe("locale label rendering", () => {
    it("uppercases locale codes", () => {
      vi.mocked(useLanguage).mockReturnValue(
        mockLanguageReady({ locales: ["fr", "de"], currentLocale: "fr" })
      );
      render(<LanguageSwitch />);
      expect(screen.getByText("FR")).toBeInTheDocument();
      expect(screen.getByText("DE")).toBeInTheDocument();
    });

    it("renders locale spans in the correct order", () => {
      vi.mocked(useLanguage).mockReturnValue(mockLanguageReady());
      render(<LanguageSwitch />);
      const spans = screen.getAllByText(/^(EN|NO)$/);
      expect(spans[0]).toHaveTextContent("EN");
      expect(spans[1]).toHaveTextContent("NO");
    });
  });
});
