import { render, screen } from "@testing-library/react";
import { expect, vi, describe, it, beforeEach } from "vitest";
import {
  useCreateEventMutation,
  useDeleteEventMutation,
  useEventsQuery,
  useUpdateEventMutation,
} from "@/hooks/useEvents";
import { NextIntlClientProvider } from "next-intl";
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

const renderWithIntl = (ui: React.ReactNode) =>
  render(
    <NextIntlClientProvider locale="en" messages={messages}>
      {ui}
    </NextIntlClientProvider>
  );

describe("Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
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

    renderWithIntl(<Page />);

    expect(screen.getByTestId("loading-spinner")).toBeTruthy();
  });

  it("shows events when loaded", () => {
    vi.mocked(useEventsQuery).mockReturnValue({
      data: [{ id: "1", name: "Test Event" }],
      isLoading: false,
    } as any);

    console.log("mock value:", useEventsQuery());

    renderWithIntl(<Page />);

    expect(screen.queryByTestId("loading-spinner")).toBeNull();
  });
});
