import { render, screen } from "@testing-library/react";
import { expect, vi, describe, it, beforeEach } from "vitest";
import {
  useCreateEventMutation,
  useDeleteEventMutation,
  useEventsQuery,
  useUpdateEventMutation,
} from "@/hooks/useEvents";
import { UseMutationResult, UseQueryResult } from "@tanstack/react-query";
import Page from "./page";
import { CreateEvent, Event, UpdateEvent } from "@/db";
import { createQueryClientWrapper } from "@test-config";

vi.mock("@/hooks/useEvents", () => ({
  useEventsQuery: vi.fn(),
  useCreateEventMutation: vi.fn(),
  useUpdateEventMutation: vi.fn(),
  useDeleteEventMutation: vi.fn(),
  useJoinAsAdminMutation: vi.fn(),
}));

vi.mock("@/components/CreateEventCard/CreateEventCard", () => ({
  default: vi.fn(() => null),
}));

vi.mock("@/components/EventCard/EventCard", () => ({
  default: vi.fn(({ data }) => <div data-testid="event-card">{data.name}</div>),
}));

const renderWithProviders = (ui: React.ReactNode) =>
  render(ui, { wrapper: createQueryClientWrapper() });

describe("Page", () => {
  beforeEach(() => {
    vi.mocked(useEventsQuery).mockReturnValue({
      data: undefined,
      isLoading: false,
    } as UseQueryResult<Event[]>);
    vi.mocked(useCreateEventMutation).mockReturnValue({
      mutateAsync: vi.fn(),
      status: "idle",
    } as unknown as UseMutationResult<Event, Error, CreateEvent>);
    vi.mocked(useUpdateEventMutation).mockReturnValue({
      mutateAsync: vi.fn(),
      status: "idle",
    } as unknown as UseMutationResult<
      Event,
      Error,
      { eventId: string; data: UpdateEvent }
    >);
    vi.mocked(useDeleteEventMutation).mockReturnValue({
      mutateAsync: vi.fn(),
      status: "idle",
    } as unknown as UseMutationResult<void, Error, { eventId: string }>);
  });

  it("shows the spinner when loading", () => {
    vi.mocked(useEventsQuery).mockReturnValue({
      data: undefined,
      isLoading: true,
    } as UseQueryResult<Event[]>);

    renderWithProviders(<Page />);

    expect(screen.getByTestId("loading-spinner")).toBeTruthy();
  });

  it("shows events when loaded", () => {
    vi.mocked(useEventsQuery).mockReturnValue({
      data: [{ id: "1", name: "Test Event" }],
      isLoading: false,
    } as UseQueryResult<Event[]>);

    renderWithProviders(<Page />);

    expect(screen.queryByTestId("loading-spinner")).toBeNull();
    expect(screen.getAllByTestId("event-card")).toHaveLength(1);
  });
});
