import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ImageCard } from "./ImageCard";

vi.unmock("@/components/ImageCard/ImageCard");

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) =>
    ({ pending: "Pending...", rejected: "Rejected" })[key] ?? key,
}));

const base = { src: "/test-image.jpg", alt: "Test image", title: "Test Title" };

describe("ImageCard", () => {
  describe("rendering", () => {
    it("renders the image with the given src and alt", () => {
      render(<ImageCard {...base} />);
      const img = screen.getByRole("img");
      expect(img).toHaveAttribute("src", base.src);
      expect(img).toHaveAttribute("alt", base.alt);
    });

    it('sets data-state="default" when no state prop is provided', () => {
      const { container } = render(<ImageCard {...base} />);
      expect(container.firstChild).toHaveAttribute("data-state", "default");
    });

    it("sets data-state to the explicit state value", () => {
      const { container } = render(<ImageCard {...base} state="selected" />);
      expect(container.firstChild).toHaveAttribute("data-state", "selected");
    });

    it('renders "Pending..." status label when state is pending', () => {
      render(<ImageCard {...base} state="pending" />);
      expect(screen.getByText("Pending...")).toBeInTheDocument();
    });

    it('renders "Rejected" status label when state is rejected', () => {
      render(<ImageCard {...base} state="rejected" />);
      expect(screen.getByText("Rejected")).toBeInTheDocument();
    });

    it.each(["default", "approved", "loading"] as const)(
      'renders no status label for "%s" state',
      state => {
        render(<ImageCard {...base} state={state} />);
        expect(screen.queryByText("Pending...")).toBeNull();
        expect(screen.queryByText("Rejected")).toBeNull();
      }
    );

    it("renders the check badge when state is selected", () => {
      const { container } = render(<ImageCard {...base} state="selected" />);
      expect(
        container.querySelector('[class*="moderateCheckBadge"]')
      ).toBeInTheDocument();
    });

    it("does not render the check badge for non-selected states", () => {
      const { container } = render(<ImageCard {...base} state="default" />);
      expect(container.querySelector('[class*="moderateCheckBadge"]')).toBeNull();
    });
  });

  describe("interactivity", () => {
    it('has role="button" and tabIndex=0 when onClick is provided', () => {
      const { container } = render(<ImageCard {...base} onClick={vi.fn()} />);
      expect(container.firstChild).toHaveAttribute("role", "button");
      expect(container.firstChild).toHaveAttribute("tabIndex", "0");
    });

    it("has no role or tabIndex when onClick is not provided", () => {
      const { container } = render(<ImageCard {...base} />);
      expect(container.firstChild).not.toHaveAttribute("role");
      expect(container.firstChild).not.toHaveAttribute("tabIndex");
    });

    it("calls onClick when the card is clicked", async () => {
      const onClick = vi.fn();
      render(<ImageCard {...base} onClick={onClick} />);
      await userEvent.click(screen.getByRole("button"));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it.each(["{Enter}", " "])("calls onClick when %s is pressed", async key => {
      const onClick = vi.fn();
      render(<ImageCard {...base} onClick={onClick} />);
      screen.getByRole("button").focus();
      await userEvent.keyboard(key);
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('sets aria-pressed="false" in default state when onClick is provided', () => {
      const { container } = render(
        <ImageCard {...base} onClick={vi.fn()} state="default" />
      );
      expect(container.firstChild).toHaveAttribute("aria-pressed", "false");
    });

    it('sets aria-pressed="true" in selected state when onClick is provided', () => {
      const { container } = render(
        <ImageCard {...base} onClick={vi.fn()} state="selected" />
      );
      expect(container.firstChild).toHaveAttribute("aria-pressed", "true");
    });

    it("aria-pressed is absent when onClick is not provided", () => {
      const { container } = render(<ImageCard {...base} state="default" />);
      expect(container.firstChild).not.toHaveAttribute("aria-pressed");
    });
  });

  describe("props passthrough", () => {
    it("forwards arbitrary data attributes via rest props", () => {
      const { container } = render(<ImageCard {...base} data-testid="custom-id" />);
      expect(container.firstChild).toHaveAttribute("data-testid", "custom-id");
    });

    it("title prop is not rendered as visible text", () => {
      render(<ImageCard {...base} title="My Title" />);
      expect(screen.queryByText("My Title")).toBeNull();
    });
  });
});
