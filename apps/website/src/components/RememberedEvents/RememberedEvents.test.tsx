import {
  defaultEventsQueryReturn,
  eventHooksMock,
  imageHooksMock,
  makeEvent,
  makeJoinedEvent,
  mockEventsLoaded,
  mockJoinedEventsLoaded,
  mockQueryResult,
  mockRouter,
} from "@test-config";
import { render, screen } from "@testing-library/react";
import { describe, expect, vi, it } from "vitest";
import RememberedEvents from "./RememberedEvents";
import { useEventsQuery, useJoinedEvents } from "@/hooks/useEvents";
import { useUploadedImageCountQuery } from "@/hooks/useImages";
import userEvent from "@testing-library/user-event";

vi.mock("@/hooks/useEvents", () => eventHooksMock());
vi.mock("@/hooks/useImages", () => imageHooksMock());

const withRememberedEvent = (eventOverrides: Parameters<typeof makeEvent>[0] = {}) => {
  const event = makeEvent(eventOverrides);
  vi.mocked(useJoinedEvents).mockReturnValue(
    mockJoinedEventsLoaded([makeJoinedEvent({ eventId: event.id })])
  );
  vi.mocked(useEventsQuery).mockReturnValue(mockEventsLoaded([event]));
  return event;
};

describe("RememberedEvents", () => {
  describe("RememberedEvents (list)", () => {
    it("renders nothing when there are no remembered events", () => {
      const { container } = render(<RememberedEvents />);
      expect(container).toBeEmptyDOMElement();
    });

    it("renders nothing when eventsQuery returns undefined", () => {
      vi.mocked(useJoinedEvents).mockReturnValue(
        mockJoinedEventsLoaded([makeJoinedEvent({ eventId: "event-1" })])
      );
      vi.mocked(useEventsQuery).mockReturnValue(defaultEventsQueryReturn);

      const { container } = render(<RememberedEvents />);
      expect(container).toBeEmptyDOMElement();
    });

    it("renders nothing when the events list is empty", () => {
      vi.mocked(useJoinedEvents).mockReturnValue(
        mockJoinedEventsLoaded([makeJoinedEvent({ eventId: "event-1" })])
      );
      vi.mocked(useEventsQuery).mockReturnValue(mockEventsLoaded([]));

      const { container } = render(<RememberedEvents />);
      expect(container).toBeEmptyDOMElement();
    });
  });

  describe("RememberedEvent (card)", () => {
    describe("upload description", () => {
      it("shows remaining count when uploads remain", () => {
        withRememberedEvent({ uploadLimit: 10 });
        vi.mocked(useUploadedImageCountQuery).mockReturnValue(
          mockQueryResult({ data: { count: 3 } })
        );

        render(<RememberedEvents />);
        // Translation key echoed back: "remaining.short" with count 7
        expect(screen.getByText("remaining.short")).toBeInTheDocument();
      });

      it("shows none.short when the upload limit is fully used", () => {
        withRememberedEvent({ uploadLimit: 5 });
        vi.mocked(useUploadedImageCountQuery).mockReturnValue(
          mockQueryResult({ data: { count: 5 } })
        );

        render(<RememberedEvents />);
        expect(screen.getByText("none.short")).toBeInTheDocument();
      });

      it("shows none.short when uploaded count exceeds the limit", () => {
        withRememberedEvent({ uploadLimit: 3 });
        vi.mocked(useUploadedImageCountQuery).mockReturnValue(
          mockQueryResult({ data: { count: 99 } })
        );

        render(<RememberedEvents />);
        expect(screen.getByText("none.short")).toBeInTheDocument();
      });

      it("shows unlimited.short when uploadLimit is null", () => {
        withRememberedEvent({ uploadLimit: null });
        render(<RememberedEvents />);
        expect(screen.getByText("unlimited.short")).toBeInTheDocument();
      });

      it("shows unlimited.short when uploadLimit is undefined", () => {
        withRememberedEvent({ uploadLimit: undefined });
        render(<RememberedEvents />);
        expect(screen.getByText("unlimited.short")).toBeInTheDocument();
      });

      it("falls back to 0 when uploadedCountData is undefined", () => {
        withRememberedEvent({ uploadLimit: 5 });
        vi.mocked(useUploadedImageCountQuery).mockReturnValue(mockQueryResult({}));

        render(<RememberedEvents />);
        // 5 remaining (5 - 0)
        expect(screen.getByText("remaining.short")).toBeInTheDocument();
      });
    });

    describe("navigation", () => {
      it("navigates to the event page when the card is clicked", async () => {
        const event = withRememberedEvent({ id: "event-42" });

        render(<RememberedEvents />);
        await userEvent.click(screen.getByText(event.name));

        expect(mockRouter.push).toHaveBeenCalledWith("/events/event-42");
      });
    });
  });
});
