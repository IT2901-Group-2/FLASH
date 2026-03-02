import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useImageSelection, rectsIntersect } from "./useImageSelection";
import type { Image } from "@/db";
import React from "react";

vi.mock("@/hooks/useImages", () => ({
  useUpdateImageMutation: vi.fn(() => ({
    mutateAsync: vi.fn(() => Promise.resolve({})),
  })),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeImages(...ids: string[]): Image[] {
  return ids.map(id => ({
    id,
    eventId: "event-1",
    isApproved: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));
}

interface ImageRect {
  id: string;
  left: number;
  top: number;
  right: number;
  bottom: number;
}

function setupContainer(imageRects: ImageRect[]): HTMLDivElement {
  const container = document.createElement("div");
  container.setPointerCapture = vi.fn();
  imageRects.forEach(({ id, left, top, right, bottom }) => {
    const el = document.createElement("div");
    el.setAttribute("data-image-id", id);
    el.getBoundingClientRect = () => ({
      left,
      top,
      right,
      bottom,
      width: right - left,
      height: bottom - top,
      x: left,
      y: top,
      toJSON: () => ({}),
    });
    container.appendChild(el);
  });
  return container;
}

function makePointerEvent(
  overrides: Partial<{
    clientX: number;
    clientY: number;
    pointerId: number;
    target: EventTarget;
  }> = {}
): React.PointerEvent<HTMLDivElement> {
  return {
    clientX: 0,
    clientY: 0,
    pointerId: 1,
    target: document.createElement("div"),
    ...overrides,
  } as unknown as React.PointerEvent<HTMLDivElement>;
}

// ---------------------------------------------------------------------------
// rectsIntersect — pure function tests
// ---------------------------------------------------------------------------

describe("rectsIntersect", () => {
  it("returns true for overlapping rects", () => {
    expect(
      rectsIntersect(
        { left: 0, right: 100, top: 0, bottom: 100 },
        { left: 50, right: 150, top: 50, bottom: 150 }
      )
    ).toBe(true);
  });

  it("returns false for non-overlapping rects (horizontal)", () => {
    expect(
      rectsIntersect(
        { left: 0, right: 100, top: 0, bottom: 100 },
        { left: 200, right: 300, top: 0, bottom: 100 }
      )
    ).toBe(false);
  });

  it("returns false for touching-edge rects", () => {
    expect(
      rectsIntersect(
        { left: 0, right: 100, top: 0, bottom: 100 },
        { left: 100, right: 200, top: 0, bottom: 100 }
      )
    ).toBe(false);
  });

  it("returns false for non-overlapping rects (vertical)", () => {
    expect(
      rectsIntersect(
        { left: 0, right: 100, top: 0, bottom: 100 },
        { left: 0, right: 100, top: 200, bottom: 300 }
      )
    ).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// useImageSelection hook tests
// ---------------------------------------------------------------------------

describe("useImageSelection", () => {
  it("drag across 3 images selects all 3", () => {
    const images = makeImages("img-1", "img-2", "img-3");
    const { result } = renderHook(() => useImageSelection(images, "event-1"));

    act(() => result.current.handleSelectToggle());

    const container = setupContainer([
      { id: "img-1", left: 0, top: 0, right: 100, bottom: 100 },
      { id: "img-2", left: 100, top: 0, right: 200, bottom: 100 },
      { id: "img-3", left: 200, top: 0, right: 300, bottom: 100 },
    ]);
    (result.current.containerRef as React.MutableRefObject<HTMLDivElement>).current =
      container;

    const target = container.querySelector('[data-image-id="img-1"]') as HTMLElement;

    // Pointer down on img-1
    act(() =>
      result.current.handlePointerDown(
        makePointerEvent({ clientX: 10, clientY: 50, target })
      )
    );
    // Move past threshold, covering all 3 images (box: x=10..290, y=50..50)
    act(() =>
      result.current.handlePointerMove(
        makePointerEvent({ clientX: 290, clientY: 50, pointerId: 1 })
      )
    );
    act(() => result.current.handlePointerUp());

    expect(result.current.selectedIds.has("img-1")).toBe(true);
    expect(result.current.selectedIds.has("img-2")).toBe(true);
    expect(result.current.selectedIds.has("img-3")).toBe(true);
  });

  it("drag from selected image deselects intersected images", () => {
    const images = makeImages("img-1", "img-2", "img-3");
    const { result } = renderHook(() => useImageSelection(images, "event-1"));

    act(() => result.current.handleSelectToggle());
    act(() => result.current.handleSelectAll()); // pre-select all

    expect(result.current.selectedIds.size).toBe(3);

    const container = setupContainer([
      { id: "img-1", left: 0, top: 0, right: 100, bottom: 100 },
      { id: "img-2", left: 100, top: 0, right: 200, bottom: 100 },
      { id: "img-3", left: 200, top: 0, right: 300, bottom: 100 },
    ]);
    (result.current.containerRef as React.MutableRefObject<HTMLDivElement>).current =
      container;

    const target = container.querySelector('[data-image-id="img-1"]') as HTMLElement;

    // Drag from img-1 (which is selected) → dragMode = "deselect"
    act(() =>
      result.current.handlePointerDown(
        makePointerEvent({ clientX: 10, clientY: 50, target })
      )
    );
    // Move to cover all 3
    act(() =>
      result.current.handlePointerMove(
        makePointerEvent({ clientX: 290, clientY: 50, pointerId: 1 })
      )
    );
    act(() => result.current.handlePointerUp());

    expect(result.current.selectedIds.has("img-1")).toBe(false);
    expect(result.current.selectedIds.has("img-2")).toBe(false);
    expect(result.current.selectedIds.has("img-3")).toBe(false);
  });

  it("short move (tap) toggles single image", () => {
    const images = makeImages("img-1");
    const { result } = renderHook(() => useImageSelection(images, "event-1"));

    act(() => result.current.handleSelectToggle());

    const container = setupContainer([
      { id: "img-1", left: 0, top: 0, right: 100, bottom: 100 },
    ]);
    (result.current.containerRef as React.MutableRefObject<HTMLDivElement>).current =
      container;

    const target = container.querySelector('[data-image-id="img-1"]') as HTMLElement;

    // Tap: move only 3px — below MIN_DRAG_DISTANCE threshold
    act(() =>
      result.current.handlePointerDown(
        makePointerEvent({ clientX: 50, clientY: 50, target })
      )
    );
    act(() =>
      result.current.handlePointerMove(
        makePointerEvent({ clientX: 53, clientY: 50, pointerId: 1 })
      )
    );
    act(() => result.current.handlePointerUp());

    expect(result.current.selectedIds.has("img-1")).toBe(true);

    // Tap again to deselect
    act(() =>
      result.current.handlePointerDown(
        makePointerEvent({ clientX: 50, clientY: 50, target })
      )
    );
    act(() => result.current.handlePointerUp());

    expect(result.current.selectedIds.has("img-1")).toBe(false);
  });

  it("pointer up clears drag state so subsequent move is a no-op", () => {
    const images = makeImages("img-1");
    const { result } = renderHook(() => useImageSelection(images, "event-1"));

    act(() => result.current.handleSelectToggle());

    const container = setupContainer([
      { id: "img-1", left: 0, top: 0, right: 100, bottom: 100 },
    ]);
    (result.current.containerRef as React.MutableRefObject<HTMLDivElement>).current =
      container;

    const target = container.querySelector('[data-image-id="img-1"]') as HTMLElement;

    // Start an active drag — selects img-1
    act(() =>
      result.current.handlePointerDown(
        makePointerEvent({ clientX: 10, clientY: 50, target })
      )
    );
    act(() =>
      result.current.handlePointerMove(
        makePointerEvent({ clientX: 90, clientY: 50, pointerId: 1 })
      )
    );
    expect(result.current.selectedIds.has("img-1")).toBe(true);

    // Pointer up
    act(() => result.current.handlePointerUp());

    // Move after pointer up should be a no-op (dragStartPos is null)
    act(() =>
      result.current.handlePointerMove(
        makePointerEvent({ clientX: -999, clientY: -999, pointerId: 1 })
      )
    );

    // selectedIds unchanged — img-1 still selected
    expect(result.current.selectedIds.has("img-1")).toBe(true);
  });

  it("images outside bounding box are unaffected", () => {
    const images = makeImages("img-1", "img-2", "img-3");
    const { result } = renderHook(() => useImageSelection(images, "event-1"));

    act(() => result.current.handleSelectToggle());

    const container = setupContainer([
      { id: "img-1", left: 0, top: 0, right: 100, bottom: 100 },
      { id: "img-2", left: 100, top: 0, right: 200, bottom: 100 },
      { id: "img-3", left: 200, top: 0, right: 300, bottom: 100 },
    ]);
    (result.current.containerRef as React.MutableRefObject<HTMLDivElement>).current =
      container;

    const target = container.querySelector('[data-image-id="img-1"]') as HTMLElement;

    // Drag covers only img-1 and img-2 (box right=190, img-3 starts at 200)
    act(() =>
      result.current.handlePointerDown(
        makePointerEvent({ clientX: 10, clientY: 50, target })
      )
    );
    act(() =>
      result.current.handlePointerMove(
        makePointerEvent({ clientX: 190, clientY: 50, pointerId: 1 })
      )
    );
    act(() => result.current.handlePointerUp());

    expect(result.current.selectedIds.has("img-1")).toBe(true);
    expect(result.current.selectedIds.has("img-2")).toBe(true);
    expect(result.current.selectedIds.has("img-3")).toBe(false);
  });

  it("exiting select mode resets selection and selectMode", () => {
    const images = makeImages("img-1", "img-2");
    const { result } = renderHook(() => useImageSelection(images, "event-1"));

    act(() => result.current.handleSelectToggle()); // enter
    act(() => result.current.handleSelectAll());

    expect(result.current.selectMode).toBe(true);
    expect(result.current.selectedIds.size).toBe(2);

    act(() => result.current.handleSelectToggle()); // exit

    expect(result.current.selectMode).toBe(false);
    expect(result.current.selectedIds.size).toBe(0);
  });
});
