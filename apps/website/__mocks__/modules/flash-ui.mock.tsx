import {
  ButtonProps,
  CardProps,
  DialogProps,
  InputProps,
  QRDisplayProps,
  TitleProps,
} from "@flash/ui";
import React from "react";
import { vi } from "vitest";

/**
 * @module flash-ui.mock
 *
 * Provides a drop-in mock factory for the `@flash/ui` component library.
 *
 * All components are replaced with minimal HTML equivalents that expose
 * `data-testid` attributes and wire up the same props your real components
 * accept, so existing assertions keep working without any changes.
 *
 * The mock is registered globally in `vitest.setup.tsx` you never need to
 * call `vi.mock("@flash/ui")` in a test file yourself.
 *
 *
 * @example
 * // The factory is already called for you in vitest.setup.tsx:
 * vi.mock("@flash/ui", () => flashUiMock());
 *
 * @example
 * // Override a single component for one test file while keeping the rest:
 * vi.mock("@flash/ui", () => ({
 *   ...flashUiMock(),
 *   ImageCard: vi.fn(({ title }) => <div data-testid="image-card">{title}</div>),
 * }));
 */
export const flashUiMock = async () => {
  const actual = await vi.importActual<typeof import("@flash/ui")>("@flash/ui");

  // ActionCard
  // Breadcrumb

  const Button = vi.fn(
    ({
      children,
      ...props
    }: ButtonProps & {
      children?: React.ReactNode;
    }) => <button {...props}>{children}</button>
  );

  const Card = vi.fn(({ children, ...rest }: CardProps) => (
    <div data-testid="card" {...rest}>
      {children}
    </div>
  ));

  const Dialog = vi.fn(({ children, ...rest }: DialogProps) => (
    <dialog data-testid="dialog" {...rest}>
      {children}
    </dialog>
  ));

  // DatePicker
  // DropdownControls
  // SegmentedControls
  // Select
  // Textarea
  // Textfield

  // ImageCard

  const Input = vi.fn(({ children, ...props }: InputProps) => {
    <input data-testid="input" {...props}>
      {children}
    </input>;
  });

  // Loader
  // Logo

  // Progressbar

  const ProgressDots = vi.fn(() => <div data-testid="progress-dots" />);

  const QRDisplay = vi.fn(({ value, code, ...rest }: QRDisplayProps) => (
    <div data-testid="qr-display" data-value={value} data-code={code} {...rest} />
  ));

  // Switch

  const Title = vi.fn(({ children, description, ...props }: TitleProps) => (
    <div>
      <h1 data-testid="title" {...props}>
        {children}
      </h1>
      {description && <p>{description}</p>}
    </div>
  ));

  return {
    ...actual,
    Button,
    ProgressDots,
    Card,
    Dialog,
    Input,
    QRDisplay,
    Title,
  };
};
