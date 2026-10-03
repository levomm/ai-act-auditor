import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { consumeLastCapturedError } from "./error-capture";

describe("error-capture", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Ensure any previously captured error is consumed/cleared before each test
    consumeLastCapturedError();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns undefined when no error has been captured", () => {
    expect(consumeLastCapturedError()).toBeUndefined();
  });

  it("captures error object from global error event", () => {
    const errorObj = new Error("Test global error");
    const event = new ErrorEvent("error", { error: errorObj });
    globalThis.dispatchEvent(event);

    expect(consumeLastCapturedError()).toBe(errorObj);
    // Consuming it should clear the captured error
    expect(consumeLastCapturedError()).toBeUndefined();
  });

  it("captures event object if error property on ErrorEvent is missing", () => {
    const event = new Event("error");
    globalThis.dispatchEvent(event);

    expect(consumeLastCapturedError()).toBe(event);
    expect(consumeLastCapturedError()).toBeUndefined();
  });

  it("captures reason from unhandledrejection event", () => {
    const rejectionReason = new Error("Test rejection reason");
    const dummyPromise = Promise.reject(rejectionReason).catch(() => {});
    let event: Event;

    if (typeof PromiseRejectionEvent !== "undefined") {
      event = new PromiseRejectionEvent("unhandledrejection", {
        promise: dummyPromise,
        reason: rejectionReason,
      });
    } else {
      event = new Event("unhandledrejection");
      (event as unknown as { reason: unknown }).reason = rejectionReason;
    }

    globalThis.dispatchEvent(event);

    expect(consumeLastCapturedError()).toBe(rejectionReason);
    expect(consumeLastCapturedError()).toBeUndefined();
  });

  it("returns error if within TTL_MS (5000ms)", () => {
    const errorObj = new Error("TTL test error");
    const event = new ErrorEvent("error", { error: errorObj });
    globalThis.dispatchEvent(event);

    // Advance time by 4900ms (within 5000ms limit)
    vi.advanceTimersByTime(4900);

    expect(consumeLastCapturedError()).toBe(errorObj);
  });

  it("returns undefined and clears error if TTL_MS (5000ms) has expired", () => {
    const errorObj = new Error("Expired error");
    const event = new ErrorEvent("error", { error: errorObj });
    globalThis.dispatchEvent(event);

    // Advance time beyond TTL (5001ms)
    vi.advanceTimersByTime(5001);

    expect(consumeLastCapturedError()).toBeUndefined();
    // Subsequent calls should also return undefined
    expect(consumeLastCapturedError()).toBeUndefined();
  });
});
