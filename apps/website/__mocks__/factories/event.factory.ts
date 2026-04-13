import type { CreateEvent, Event, EventStats, UpdateEvent } from "@/db";

let _counter = 1;
const nextId = () => `event-${_counter++}`;

/**
 * Creates a fully-populated Event. Any field can be overridden.
 *
 * @example
 * const event = makeEvent({ name: "Birthday Bash", uploadLimit: 10 });
 */
export const makeEvent = (overrides: Partial<Event> = {}): Event => {
  return {
    id: nextId(),
    name: "Test Event",
    description: "A test event description",
    startDate: new Date(),
    endDate: new Date(),
    uploadLimit: 5,
    isArchived: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
};

/**
 * Creates a CreateEvent input payload.
 *
 * @example
 * const payload = makeCreateEvent({ name: "Launch Party" });
 */
export const makeCreateEvent = (overrides: Partial<CreateEvent> = {}): CreateEvent => {
  return {
    name: "New Test Event",
    description: "",
    startDate: new Date(),
    endDate: new Date(),
    uploadLimit: 5,
    ...overrides,
  };
};

/**
 * Creates an UpdateEvent patch payload.
 *
 * @example
 * const patch = makeUpdateEvent({ name: "Renamed Event" });
 */
export const makeUpdateEvent = (overrides: Partial<UpdateEvent> = {}): UpdateEvent => {
  return {
    name: "Updated Event",
    description: "Updated description",
    uploadLimit: 10,
    ...overrides,
  };
};

/**
 * Creates a fully-populated `EventStats` object.
 *
 * @example
 * const eventStats = makeEventStats({ pendingImages: 2 });
 *
 * @param overrides An object used to override the properties of the returned object.
 * @returns An `EventStats` object.
 */
export const makeEventStats = (overrides: Partial<EventStats> = {}): EventStats => {
  return {
    eventId: nextId(),
    pendingImages: 0,
    approvedImages: 0,
    rejectedImages: 0,
    ...overrides,
  };
};

/**
 * Resets the internal ID counter.
 * Call in beforeEach if ID stability matters.
 */
export const resetEventCounter = () => {
  _counter = 1;
};
