import { InputProps } from "@flash/ui";
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
export const flashUiMock = () => ({
  Button: vi.fn(
    ({
      children,
      ...props
    }: React.ButtonHTMLAttributes<HTMLButtonElement> & {
      children?: React.ReactNode;
    }) => <button {...props}>{children}</button>
  ),

  ProgressDots: vi.fn(() => <div data-testid="progress-dots" />),

  Card: vi.fn(({ children }: { children?: React.ReactNode }) => (
    <div data-testid="card">{children}</div>
  )),

  Dialog: vi.fn(({ children }: { children?: React.ReactNode }) => (
    <div data-testid="dialog">{children}</div>
  )),

  Input: vi.fn(({ children, ...props }: InputProps) => {
    <input data-testid="input" {...props}>
      {children}
    </input>;
  }),

  QRDisplay: vi.fn(({ value, code }: { value: string; code: string }) => (
    <div data-testid="qr-display" data-value={value} data-code={code} />
  )),

  Title: vi.fn(
    ({
      children,
      description,
      ...props
    }: {
      children: React.ReactNode;
      description?: string;
      [key: string]: unknown;
    }) => (
      <div>
        <h1 data-testid="title" {...props}>
          {children}
        </h1>
        {description && <p>{description}</p>}
      </div>
    )
  ),

  ImageCard: vi.fn(
    ({
      state,
      onClick,
      title,
      ...rest
    }: {
      state?: string;
      onClick?: () => void;
      title?: string;
      [key: string]: unknown;
    }) => (
      <div
        data-testid={`image-card-${rest["data-image-id"] ?? rest["id"]}`}
        data-state={state}
        data-image-id={rest["data-image-id"] ?? rest["id"]}
        onClick={onClick}
      >
        {title && <span>{title}</span>}
      </div>
    )
  ),

  ActionCard: vi.fn(
    ({
      description,
      primaryButton,
      secondaryButton,
    }: {
      description?: string;
      primaryButton?: { text: string; onClick: () => void };
      secondaryButton?: { text: string; onClick: () => void };
    }) => (
      <div data-testid="action-card">
        {description && <span data-testid="action-card-description">{description}</span>}
        {primaryButton && (
          <button data-testid="primary-action" onClick={primaryButton.onClick}>
            {primaryButton.text}
          </button>
        )}
        {secondaryButton && (
          <button data-testid="secondary-action" onClick={secondaryButton.onClick}>
            {secondaryButton.text}
          </button>
        )}
      </div>
    )
  ),

  SegmentedControl: Object.assign(
    ({
      children,
      value,
      onChange,
      ...props
    }: {
      children: React.ReactNode;
      value: string;
      onChange: (v: string) => void;
      [key: string]: unknown;
    }) => (
      <div data-testid="segmented-control" data-value={value} {...props}>
        {Array.isArray(children)
          ? children.map(
              (child: React.ReactElement<{ _onChange?: (v: string) => void }>) =>
                child ? React.cloneElement(child, { _onChange: onChange }) : child
            )
          : children}
      </div>
    ),
    {
      Item: ({
        value,
        label,
        disabled,
        _onChange,
      }: {
        value: string;
        label: string;
        disabled?: boolean;
        _onChange?: (v: string) => void;
      }) => (
        <button
          data-testid={`tab-${value}`}
          disabled={disabled}
          onClick={() => _onChange?.(value)}
        >
          {label}
        </button>
      ),
    }
  ),
});
