import type { CreateEvent, Event, UpdateEvent } from "@/db";

let _counter = 1;
const nextId = () => `event-${_counter++}`;

/**
 * Creates a fully-populated Event. Any field can be overridden.
 *
 * @example
 * const event = makeEvent({ name: "Birthday Bash", uploadLimit: 10 });
 */
export function makeEvent(overrides: Partial<Event> = {}): Event {
  return {
    id: nextId(),
    name: "Test Event",
    description: "A test event description",
    startDate: new Date("2026-03-01T10:00:00.000Z"),
    endDate: new Date("2026-03-02T10:00:00.000Z"),
    uploadLimit: 5,
    isArchived: false,
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    updatedAt: new Date("2026-01-01T00:00:00.000Z"),
    ...overrides,
  };
}

/**
 * Creates a CreateEvent input payload.
 *
 * @example
 * const payload = makeCreateEvent({ name: "Launch Party" });
 */
export function makeCreateEvent(overrides: Partial<CreateEvent> = {}): CreateEvent {
  return {
    name: "New Test Event",
    description: "",
    startDate: new Date("2026-03-01T10:00:00.000Z"),
    endDate: new Date("2026-03-02T10:00:00.000Z"),
    uploadLimit: 5,
    ...overrides,
  };
}

/**
 * Creates an UpdateEvent patch payload.
 *
 * @example
 * const patch = makeUpdateEvent({ name: "Renamed Event" });
 */
export function makeUpdateEvent(overrides: Partial<UpdateEvent> = {}): UpdateEvent {
  return {
    name: "Updated Event",
    description: "Updated description",
    uploadLimit: 10,
    ...overrides,
  };
}

/** Resets the internal ID counter — call in beforeEach if ID stability matters. */
export function resetEventCounter() {
  _counter = 1;
}
