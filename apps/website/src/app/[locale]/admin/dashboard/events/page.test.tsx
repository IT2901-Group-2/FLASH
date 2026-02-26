import { cleanup, render, screen } from "@testing-library/react";
import { expect, vi, describe, it, beforeEach, afterEach } from "vitest";
import {
  useCreateEventMutation,
  useDeleteEventMutation,
  useEventsQuery,
  useUpdateEventMutation,
} from "@/hooks/useEvents";
import { NextIntlClientProvider } from "next-intl";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Page from "./page";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
  NextIntlClientProvider: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({ push: vi.fn() })),
}));

vi.mock("@/hooks/useEvents", () => ({
  useEventsQuery: vi.fn(),
  useCreateEventMutation: vi.fn(),
  useUpdateEventMutation: vi.fn(),
  useDeleteEventMutation: vi.fn(),
}));

vi.mock("@/components/CreateEventCard/CreateEventCard", () => ({
  default: vi.fn(() => null),
}));

vi.mock("@/components/EventCard/EventCard", () => ({
  default: vi.fn(({ data }) => <div data-testid="event-card">{data.name}</div>),
}));

const messages = {
  admin: {
    dashboard: {
      event: {
        page: {
          title: "Events",
          description: "Manage events",
          createNew: "Create new",
        },
      },
    },
  },
};

// Fresh QueryClient per test to avoid state leaking between tests
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <NextIntlClientProvider locale="en" messages={messages}>
        {children}
      </NextIntlClientProvider>
    </QueryClientProvider>
  );
};

const renderWithProviders = (ui: React.ReactNode) =>
  render(ui, { wrapper: createWrapper() });

describe("Page", () => {
  afterEach(() => {
    cleanup();
  });
  beforeEach(() => {
    vi.mocked(useEventsQuery).mockReturnValue({
      data: undefined,
      isLoading: false,
    } as any);
    vi.mocked(useCreateEventMutation).mockReturnValue({
      mutateAsync: vi.fn(),
      status: "idle",
    } as any);
    vi.mocked(useUpdateEventMutation).mockReturnValue({
      mutateAsync: vi.fn(),
      status: "idle",
    } as any);
    vi.mocked(useDeleteEventMutation).mockReturnValue({
      mutateAsync: vi.fn(),
      status: "idle",
    } as any);
  });

  it("shows the spinner when loading", () => {
    vi.mocked(useEventsQuery).mockReturnValue({
      data: undefined,
      isLoading: true,
    } as any);

    renderWithProviders(<Page />);

    expect(screen.getByTestId("loading-spinner")).toBeTruthy();
  });

  it("shows events when loaded", () => {
    vi.mocked(useEventsQuery).mockReturnValue({
      data: [{ id: "1", name: "Test Event" }],
      isLoading: false,
    } as any);

    renderWithProviders(<Page />);

    expect(screen.queryByTestId("loading-spinner")).toBeNull();
    expect(screen.getAllByTestId("event-card")).toHaveLength(1);
  });
});
