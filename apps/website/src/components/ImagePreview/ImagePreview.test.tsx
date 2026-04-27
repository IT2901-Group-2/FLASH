import { afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { makeImage } from "@test-config";
import { ImagePreview } from "./ImagePreview";
import styles from "./ImagePreview.module.css";

const eventId = "event-123";

const getImageAlt = (index: number, total: number) => `Image ${index + 1} of ${total}`;

describe("ImagePreview", () => {
  afterEach(() => {
    vi.clearAllMocks();
    if (styles.bodyLocked) {
      document.body.classList.remove(styles.bodyLocked);
    }
  });

  it("renders nothing when previewIndex is null", () => {
    render(
      <ImagePreview
        eventId={eventId}
        images={[makeImage(), makeImage()]}
        previewIndex={null}
        setPreviewIndex={vi.fn()}
        getImageAlt={getImageAlt}
      />
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders the selected image and closes on escape", () => {
    const setPreviewIndex = vi.fn();
    const images = [makeImage({ id: "img-1" }), makeImage({ id: "img-2" })];

    render(
      <ImagePreview
        eventId={eventId}
        images={images}
        previewIndex={1}
        setPreviewIndex={setPreviewIndex}
        getImageAlt={getImageAlt}
      />
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByAltText("Image 2 of 2")).toHaveAttribute(
      "src",
      `/api/events/${eventId}/images/img-2`
    );

    fireEvent.keyDown(window, { key: "Escape" });
    expect(setPreviewIndex).toHaveBeenCalledWith(null);
  });

  it("adds and removes body lock class while open", () => {
    const setPreviewIndex = vi.fn();
    const images = [makeImage({ id: "img-1" })];
    const bodyLockedClass = styles.bodyLocked;

    expect(bodyLockedClass).toBeDefined();

    const { rerender } = render(
      <ImagePreview
        eventId={eventId}
        images={images}
        previewIndex={0}
        setPreviewIndex={setPreviewIndex}
        getImageAlt={getImageAlt}
      />
    );

    expect(document.body.classList.contains(bodyLockedClass as string)).toBe(true);

    rerender(
      <ImagePreview
        eventId={eventId}
        images={images}
        previewIndex={null}
        setPreviewIndex={setPreviewIndex}
        getImageAlt={getImageAlt}
      />
    );

    expect(document.body.classList.contains(bodyLockedClass as string)).toBe(false);
  });

  it("closes when close button is clicked", () => {
    const setPreviewIndex = vi.fn();

    render(
      <ImagePreview
        eventId={eventId}
        images={[makeImage(), makeImage()]}
        previewIndex={0}
        setPreviewIndex={setPreviewIndex}
        getImageAlt={getImageAlt}
      />
    );

    const buttons = screen.getAllByRole("button");
    const closeButton = buttons[0];

    expect(closeButton).toBeDefined();
    fireEvent.click(closeButton as HTMLElement);

    expect(setPreviewIndex).toHaveBeenCalledWith(null);
  });

  it("navigates with prev/next buttons and wraps around", () => {
    const setPreviewIndex = vi.fn();

    render(
      <ImagePreview
        eventId={eventId}
        images={[makeImage(), makeImage(), makeImage()]}
        previewIndex={0}
        setPreviewIndex={setPreviewIndex}
        getImageAlt={getImageAlt}
      />
    );

    const buttons = screen.getAllByRole("button");
    const prevButton = buttons[1];
    const nextButton = buttons[2];

    expect(prevButton).toBeDefined();
    expect(nextButton).toBeDefined();

    fireEvent.click(prevButton as HTMLElement);
    fireEvent.click(nextButton as HTMLElement);

    expect(setPreviewIndex).toHaveBeenNthCalledWith(1, 2);
    expect(setPreviewIndex).toHaveBeenNthCalledWith(2, 1);
  });

  it("clamps preview index when images shrink", () => {
    const setPreviewIndex = vi.fn();
    const images = [makeImage(), makeImage(), makeImage()];

    const { rerender } = render(
      <ImagePreview
        eventId={eventId}
        images={images}
        previewIndex={2}
        setPreviewIndex={setPreviewIndex}
        getImageAlt={getImageAlt}
      />
    );

    rerender(
      <ImagePreview
        eventId={eventId}
        images={[makeImage()]}
        previewIndex={2}
        setPreviewIndex={setPreviewIndex}
        getImageAlt={getImageAlt}
      />
    );

    expect(setPreviewIndex).toHaveBeenCalledWith(0);
  });
});
