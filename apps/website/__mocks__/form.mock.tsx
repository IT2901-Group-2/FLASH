import { ReactNode } from "react";
import { FormProvider, useForm, UseFormReturn } from "react-hook-form";
import { render, RenderOptions, RenderResult } from "@testing-library/react";
import { CreateEvent, UpdateEvent } from "@/db";

/**
 * Test utilities for rendering steps with a real form context.
 *
 * Provides a TEST_DEFAULT_FORM_DATA object with all required fields pre-filled,
 */
export const TEST_DEFAULT_FORM_DATA: CreateEvent = {
  name: "",
  description: "",
  startDate: new Date("2025-01-01T10:00:00"),
  endDate: new Date("2025-01-01T23:59:00"),
  uploadLimit: null,
};

/**
 * A real FormProvider wrapper that lets useFormContext() work in tests.
 * Also exposes the form methods via onMethods callback for tests that need to inspect or interact with the form state.
 *
 * @example
 * const { getByText } = renderWithForm(<BasicInfoStep />, {
 *   defaultValues: { name: "Pre-filled", … }
 * });
 */
export const TEST_EVENT: UpdateEvent & { id: string } = {
  id: "evt-123",
  name: "Test Event",
  description: "A test event",
  startDate: new Date("2025-06-01T10:00:00"),
  endDate: new Date("2025-06-01T23:59:00"),
  uploadLimit: null,
};

interface FormWrapperProps<T extends object> {
  children: ReactNode;
  defaultValues?: T;
  /** Escape hatch: lets a test inspect or interact with the form methods. */
  onMethods?: (m: UseFormReturn<T>) => void;
}

/**
 * Wraps children in a real FormProvider so useFormContext() resolves.
 * Use this for step components (BasicInfoStep, OptionsStep, …).
 */
export function FormWrapper<T extends object>({
  children,
  defaultValues,
  onMethods,
}: FormWrapperProps<T>) {
  const methods = useForm<T>({
    defaultValues: defaultValues as undefined,
    mode: "onChange",
  });
  onMethods?.(methods);
  return <FormProvider {...methods}>{children}</FormProvider>;
}

/**
 * Convenience wrapper around RTL render() that automatically injects
 * a FormProvider.
 *
 * @example
 *   const { getByText } = renderWithForm(<BasicInfoStep />, {
 *     defaultValues: { name: "Pre-filled", … }
 *   });
 */
export function renderWithForm(
  ui: ReactNode,
  {
    defaultValues = TEST_DEFAULT_FORM_DATA,
    onMethods,
    ...renderOptions
  }: RenderOptions & {
    defaultValues?: object;
    onMethods?: (m: UseFormReturn<CreateEvent | UpdateEvent>) => void;
  } = {}
): RenderResult {
  return render(
    <FormWrapper defaultValues={defaultValues} onMethods={onMethods}>
      {ui}
    </FormWrapper>,
    renderOptions
  );
}
