import { afterEach, describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { useRef } from "react";
import { makeImage } from "@test-config";
import { ImagePreview, ImagePreviewHandle } from "./ImagePreview";
import styles from "./ImagePreview.module.css";

describe("ImagePreview", () => {
  afterEach(() => {
    if (styles.bodyLocked) {
      document.body.classList.remove(styles.bodyLocked);
    }
  });

  it("renders nothing until opened", () => {
    const TestComponent = () => {
      const ref = useRef<ImagePreviewHandle>(null);

      return <ImagePreview ref={ref} images={[makeImage(), makeImage()]} />;
    };

    render(<TestComponent />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens the requested image through the ref handle", () => {
    const TestComponent = () => {
      const ref = useRef<ImagePreviewHandle>(null);

      return (
        <div>
          <ImagePreview ref={ref} images={[makeImage(), makeImage()]} />
          <button onClick={() => ref.current?.open(1)} data-testid="open-preview">
            Open preview
          </button>
        </div>
      );
    };

    render(<TestComponent />);

    fireEvent.click(screen.getByTestId("open-preview"));

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByAltText("Image 2 of 2")).toBeInTheDocument();
  });

  it("closes when Escape is pressed", () => {
    const TestComponent = () => {
      const ref = useRef<ImagePreviewHandle>(null);

      return (
        <div>
          <ImagePreview ref={ref} images={[makeImage(), makeImage()]} />
          <button onClick={() => ref.current?.open(0)} data-testid="open-preview">
            Open preview
          </button>
        </div>
      );
    };

    render(<TestComponent />);

    fireEvent.click(screen.getByTestId("open-preview"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    fireEvent.keyDown(window, { key: "Escape" });

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("adds and removes the body lock class while open", () => {
    const bodyLockedClass = styles.bodyLocked;
    expect(bodyLockedClass).toBeDefined();

    const TestComponent = () => {
      const ref = useRef<ImagePreviewHandle>(null);

      return (
        <div>
          <ImagePreview ref={ref} images={[makeImage()]} />
          <button onClick={() => ref.current?.open(0)} data-testid="open-preview">
            Open preview
          </button>
        </div>
      );
    };

    render(<TestComponent />);

    fireEvent.click(screen.getByTestId("open-preview"));

    expect(document.body.classList.contains(bodyLockedClass as string)).toBe(true);

    fireEvent.keyDown(window, { key: "Escape" });

    expect(document.body.classList.contains(bodyLockedClass as string)).toBe(false);
  });

  it("closes when the close button is clicked", () => {
    const closeButtonClass = styles.previewClose;
    expect(closeButtonClass).toBeDefined();

    const TestComponent = () => {
      const ref = useRef<ImagePreviewHandle>(null);

      return (
        <div>
          <ImagePreview ref={ref} images={[makeImage(), makeImage()]} />
          <button onClick={() => ref.current?.open(0)} data-testid="open-preview">
            Open preview
          </button>
        </div>
      );
    };

    render(<TestComponent />);

    fireEvent.click(screen.getByTestId("open-preview"));

    const closeButton = screen
      .getAllByRole("button")
      .find(button => button.classList.contains(closeButtonClass as string));

    expect(closeButton).toBeDefined();

    if (closeButton) {
      fireEvent.click(closeButton);
    }

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("navigates between images", () => {
    const nextButtonClass = styles.previewNavButtonRight;
    expect(nextButtonClass).toBeDefined();

    const TestComponent = () => {
      const ref = useRef<ImagePreviewHandle>(null);

      return (
        <div>
          <ImagePreview ref={ref} images={[makeImage(), makeImage(), makeImage()]} />
          <button onClick={() => ref.current?.open(0)} data-testid="open-preview">
            Open preview
          </button>
        </div>
      );
    };

    render(<TestComponent />);

    fireEvent.click(screen.getByTestId("open-preview"));

    expect(screen.getByAltText("Image 1 of 3")).toBeInTheDocument();

    const nextButton = screen
      .getAllByRole("button")
      .find(button => button.classList.contains(nextButtonClass as string));

    expect(nextButton).toBeDefined();

    if (nextButton) {
      fireEvent.click(nextButton);
    }

    expect(screen.getByAltText("Image 2 of 3")).toBeInTheDocument();
  });
});
