import { vi } from "vitest";
import type { Control, FieldErrors, UseFormReturn } from "react-hook-form";

// ---------------------------------------------------------------------------
// Default return values
// ---------------------------------------------------------------------------

/**
 * Idle default returned by `useFormContext` and `useForm`.
 * Spread and replace individual fields to control form state per-test:
 *
 * @example
 * vi.mocked(useFormContext).mockReturnValue({
 *   ...defaultFormContextReturn,
 *   watch: vi.fn().mockReturnValue(10),
 * });
 */
export const defaultFormContextReturn = {
  register: vi.fn().mockReturnValue({
    name: "",
    ref: vi.fn(),
    onChange: vi.fn(),
    onBlur: vi.fn(),
  }),
  setValue: vi.fn(),
  watch: vi.fn().mockReturnValue(undefined),
  handleSubmit: vi.fn((cb: (data: unknown) => void) => () => cb({})),
  reset: vi.fn(),
  trigger: vi.fn(),
  setError: vi.fn(),
  clearErrors: vi.fn(),
  control: {} as Control,
  formState: {
    errors: {},
    isSubmitting: false,
    isValid: true,
    isDirty: false,
    isSubmitted: false,
    isSubmitSuccessful: false,
    submitCount: 0,
  },
} as unknown as UseFormReturn;

/**
 * Idle default returned by `useFormState`.
 * Spread and replace `errors` to simulate validation failures:
 *
 * @example
 * vi.mocked(useFormState).mockReturnValue({
 *   ...defaultFormStateReturn,
 *   errors: { email: { message: "Invalid email" } },
 * });
 */
export const defaultFormStateReturn = {
  errors: {} as FieldErrors,
  isSubmitting: false,
  isValid: true,
  isDirty: false,
  isSubmitted: false,
  isSubmitSuccessful: false,
  submitCount: 0,
};

// ---------------------------------------------------------------------------
// State builders
// ---------------------------------------------------------------------------

/**
 * Returns a `useFormContext` return value with the given watched field value.
 * Use when a component's behaviour branches on `watch(fieldName)`.
 *
 * @example
 * vi.mocked(useFormContext).mockReturnValue(mockFormWatching(10));
 * // component sees uploadLimit = 10 → renders in "limited" mode
 */
export const mockFormWatching = (value: unknown): UseFormReturn =>
  ({
    ...defaultFormContextReturn,
    watch: vi.fn().mockReturnValue(value),
  }) as unknown as UseFormReturn;

/**
 * Returns a `useFormState` return value with the given field errors.
 *
 * @example
 * vi.mocked(useFormState).mockReturnValue(
 *   mockFormErrors({ uploadLimit: { message: "Must be at least 1" } })
 * );
 */
export const mockFormErrors = (errors: FieldErrors): typeof defaultFormStateReturn => ({
  ...defaultFormStateReturn,
  errors,
  isValid: false,
});

/**
 * Returns a `useFormState` return value in a submitting state.
 *
 * @example
 * vi.mocked(useFormState).mockReturnValue(mockFormSubmitting());
 */
export const mockFormSubmitting = (): typeof defaultFormStateReturn => ({
  ...defaultFormStateReturn,
  isSubmitting: true,
  isValid: false,
});

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

/**
 * Drop-in `vi.mock()` factory for `react-hook-form`.
 *
 * All hooks return typed idle defaults. Override individual hooks per-test
 * using `vi.mocked()`.
 *
 * @example
 * // vitest.setup.tsx — register once globally
 * vi.mock("react-hook-form", () => reactHookFormMock());
 */
export const reactHookFormMock = () => ({
  useFormContext: vi.fn(() => ({ ...defaultFormContextReturn })),
  useFormState: vi.fn(() => ({ ...defaultFormStateReturn })),
  useForm: vi.fn(() => ({ ...defaultFormContextReturn })),
  Controller: ({
    name,
    render,
  }: {
    name: string;
    render: (props: {
      field: ReturnType<typeof defaultFormContextReturn.register>;
    }) => React.ReactNode;
  }) => render({ field: defaultFormContextReturn.register(name) }),
});
