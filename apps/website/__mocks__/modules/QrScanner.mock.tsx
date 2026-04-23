import { vi } from "vitest";
import type { IScannerProps } from "@yudiel/react-qr-scanner";

/**
 * Minimal `Scanner` stand-in. Renders a `<div data-testid="qr-scanner">` and
 * forwards every prop so tests can assert on the values passed by the parent.
 *
 * `onScan` is left callable so tests can simulate a scan result:
 * @example
 * import { Scanner } from "@yudiel/react-qr-scanner";
 * vi.mocked(Scanner).mock.calls[0][0].onScan?.([{ rawValue: "abc123", ... }]);
 */
export const Scanner = vi.fn(({ constraints, components, sound }: IScannerProps) => (
  <div
    data-testid="qr-scanner"
    data-sound={sound}
    data-facing-mode={(constraints as MediaTrackConstraints | undefined)?.facingMode}
    data-finder={String(components?.finder)}
  />
));

/**
 * Drop-in `vi.mock()` factory for `@yudiel/react-qr-scanner`.
 *
 * @example
 * vi.mock("@yudiel/react-qr-scanner", () => qrScannerMock());
 *
 * // Simulate a successful scan in a test:
 * import { Scanner } from "@yudiel/react-qr-scanner";
 * vi.mocked(Scanner).mock.calls[0][0].onScan?.([{ rawValue: "EVENT-123", format: "qr_code" }]);
 */
export const qrScannerMock = () => ({ Scanner });
