import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  createDate,
  formatDateForInput,
  formatTimeForInput,
  parseTimeOrDate,
} from "./date-utils";

describe("formatDateForInput", () => {
  it("formats a date in YYYY-MM-DD format", () => {
    const date = new Date(2026, 0, 5); // Jan 5, 2026
    expect(formatDateForInput(date)).toBe("2026-01-05");
  });

  it("pads single-digit month and day with leading zeros", () => {
    const date = new Date(2026, 2, 7); // Mar 7, 2026
    expect(formatDateForInput(date)).toBe("2026-03-07");
  });

  it("handles double-digit month and day", () => {
    const date = new Date(2026, 11, 31); // Dec 31, 2026
    expect(formatDateForInput(date)).toBe("2026-12-31");
  });

  it("returns empty string for a falsy value", () => {
    expect(formatDateForInput(null as unknown as Date)).toBe("");
    expect(formatDateForInput(undefined as unknown as Date)).toBe("");
  });
});

describe("formatTimeForInput", () => {
  it("formats time in HH:MM format", () => {
    const date = new Date(2026, 0, 1, 10, 25); // 10:25
    expect(formatTimeForInput(date)).toBe("10:25");
  });

  it("pads single-digit hours and minutes with leading zeros", () => {
    const date = new Date(2026, 0, 1, 3, 4); // 03:04
    expect(formatTimeForInput(date)).toBe("03:04");
  });

  it("handles midnight (00:00)", () => {
    const date = new Date(2026, 0, 1, 0, 0);
    expect(formatTimeForInput(date)).toBe("00:00");
  });

  it("handles end of day (23:59)", () => {
    const date = new Date(2026, 0, 1, 23, 59);
    expect(formatTimeForInput(date)).toBe("23:59");
  });

  it("returns empty string for a falsy value", () => {
    expect(formatTimeForInput(null as unknown as Date)).toBe("");
    expect(formatTimeForInput(undefined as unknown as Date)).toBe("");
  });
});

describe("createDate", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 5, 15, 12, 30, 0, 0)); // Jun 15, 2026 12:30
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns today's date when called with no arguments", () => {
    const result = createDate();
    expect(result.getFullYear()).toBe(2026);
    expect(result.getMonth()).toBe(5);
    expect(result.getDate()).toBe(15);
  });

  it("defaults hours and minutes to 0 when not provided", () => {
    const result = createDate();
    expect(result.getHours()).toBe(0);
    expect(result.getMinutes()).toBe(0);
    expect(result.getSeconds()).toBe(0);
    expect(result.getMilliseconds()).toBe(0);
  });

  it("sets the provided hours and minutes", () => {
    const result = createDate({ hours: 14, minutes: 45 });
    expect(result.getHours()).toBe(14);
    expect(result.getMinutes()).toBe(45);
    expect(result.getSeconds()).toBe(0);
  });

  it("uses the provided base date", () => {
    const base = new Date(2020, 0, 20); // Jan 20, 2020
    const result = createDate({ date: base, hours: 8, minutes: 30 });
    expect(result.getFullYear()).toBe(2020);
    expect(result.getMonth()).toBe(0);
    expect(result.getDate()).toBe(20);
    expect(result.getHours()).toBe(8);
    expect(result.getMinutes()).toBe(30);
  });

  it("does not mutate the original base date", () => {
    const base = new Date(2020, 0, 20, 10, 0, 0, 0);
    const originalTime = base.getTime();
    createDate({ date: base, hours: 22, minutes: 59 });
    expect(base.getTime()).toBe(originalTime);
  });

  it("zeroes out seconds and milliseconds regardless of base date", () => {
    const base = new Date(2026, 0, 1, 10, 20, 30, 999);
    const result = createDate({ date: base, hours: 10, minutes: 20 });
    expect(result.getSeconds()).toBe(0);
    expect(result.getMilliseconds()).toBe(0);
  });
});

describe("parseTimeOrDate", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 5, 15, 12, 30, 0, 0)); // Jun 15, 2026 12:30
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("string input (HH:mm)", () => {
    it("parses a time string into a Date with correct hours and minutes", () => {
      const result = parseTimeOrDate("09:30");
      expect(result.getHours()).toBe(9);
      expect(result.getMinutes()).toBe(30);
    });

    it("parses midnight correctly", () => {
      const result = parseTimeOrDate("00:00");
      expect(result.getHours()).toBe(0);
      expect(result.getMinutes()).toBe(0);
    });

    it("parses end-of-day time correctly", () => {
      const result = parseTimeOrDate("23:59");
      expect(result.getHours()).toBe(23);
      expect(result.getMinutes()).toBe(59);
    });

    it("uses today as the base date when given a time string", () => {
      const result = parseTimeOrDate("10:00");
      expect(result.getFullYear()).toBe(2026);
      expect(result.getMonth()).toBe(5);
      expect(result.getDate()).toBe(15);
    });

    it("zeroes out seconds and milliseconds", () => {
      const result = parseTimeOrDate("10:00");
      expect(result.getSeconds()).toBe(0);
      expect(result.getMilliseconds()).toBe(0);
    });
  });

  describe("object input", () => {
    it("delegates to createDate with the given object", () => {
      const base = new Date(2022, 3, 10); // Apr 10, 2022
      const result = parseTimeOrDate({ date: base, hours: 7, minutes: 15 });
      expect(result.getFullYear()).toBe(2022);
      expect(result.getMonth()).toBe(3);
      expect(result.getDate()).toBe(10);
      expect(result.getHours()).toBe(7);
      expect(result.getMinutes()).toBe(15);
    });

    it("defaults hours and minutes to 0 for an empty object", () => {
      const result = parseTimeOrDate({});
      expect(result.getHours()).toBe(0);
      expect(result.getMinutes()).toBe(0);
    });

    it("uses today when no base date is provided in the object", () => {
      const result = parseTimeOrDate({ hours: 18, minutes: 45 });
      expect(result.getFullYear()).toBe(2026);
      expect(result.getMonth()).toBe(5);
      expect(result.getDate()).toBe(15);
      expect(result.getHours()).toBe(18);
      expect(result.getMinutes()).toBe(45);
    });

    it("does not mutate the provided base date", () => {
      const base = new Date(2022, 3, 10, 5, 0, 0, 0);
      const originalTime = base.getTime();
      parseTimeOrDate({ date: base, hours: 22, minutes: 0 });
      expect(base.getTime()).toBe(originalTime);
    });
  });
});
