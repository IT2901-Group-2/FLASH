/* eslint-disable @next/next/no-img-element */
import {
  ButtonProps,
  CardProps,
  DialogProps,
  ImageCardProps,
  InputProps,
  LoaderProps,
  LogoProps,
  ProgressBarProps,
  ProgressDotsProps,
  QRDisplayProps,
  SwitchProps,
  TextareaProps,
  TextFieldProps,
  TitleProps,
} from "@flash/ui";
import React, { useId } from "react";
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

  const Textarea = vi.fn(({ label, error, ...props }: TextareaProps) => {
    const id = useId();
    return (
      <div>
        <label htmlFor={id}>{label}</label>
        <textarea id={id} data-testid="textarea" {...props} />
        {error && <p data-testid="textarea-error">{error}</p>}
      </div>
    );
  });

  const TextField = vi.fn(({ label, size, error, ...rest }: TextFieldProps) => {
    const id = useId();
    return (
      <div>
        <label htmlFor={id}>{label}</label>
        <input id={id} data-testid="text-field" data-size={size} {...rest} />
        {error && <p data-testid="text-field-error">{error}</p>}
      </div>
    );
  });

  const ImageCard = vi.fn(
    ({ src, alt, title, state = "default", ...props }: ImageCardProps) => (
      <div data-testid="image-card" data-state={state} {...props}>
        <img src={src} alt={alt} />
        <span>{title}</span>
      </div>
    )
  );

  const Input = vi.fn(({ ...props }: InputProps) => {
    const id = useId();
    return <input id={id} data-testid="input" {...props} />;
  });

  const Loader = vi.fn(({ ...rest }: LoaderProps) => (
    <svg data-testid="loader" {...rest} />
  ));

  const Logo = vi.fn(({ ...rest }: LogoProps) => <svg data-testid="logo" {...rest} />);

  const ProgressBar = vi.fn(({ value = 0, maxValue = 100 }: ProgressBarProps) => (
    <div data-testid="progress-bar" data-value={value} data-max={maxValue} />
  ));

  const ProgressDots = vi.fn(({ maxValue, value }: ProgressDotsProps) => (
    <div data-testid="progress-dots" data-value={value} data-max-value={maxValue} />
  ));

  const QRDisplay = vi.fn(({ value, code, ...rest }: QRDisplayProps) => (
    <div data-testid="qr-display" data-value={value} data-code={code} {...rest}>
      <svg />
    </div>
  ));

  const Switch = vi.fn(({ children, size, ...rest }: SwitchProps) => (
    <div data-testid="switch" data-size={size}>
      <label>{children}</label>
      <input {...rest} />
    </div>
  ));

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
    Card,
    Dialog,
    Textarea,
    TextField,
    ImageCard,
    Input,
    Loader,
    Logo,
    ProgressBar,
    ProgressDots,
    QRDisplay,
    Switch,
    Title,
  };
};
