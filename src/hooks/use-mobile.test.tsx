import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useIsMobile } from "./use-mobile";

describe("useIsMobile hook", () => {
  let listeners: Array<(e: MediaQueryListEvent) => void> = [];
  const addEventListenerMock = vi.fn(
    (event: string, listener: (e: MediaQueryListEvent) => void) => {
      if (event === "change") {
        listeners.push(listener);
      }
    },
  );
  const removeEventListenerMock = vi.fn(
    (event: string, listener: (e: MediaQueryListEvent) => void) => {
      if (event === "change") {
        listeners = listeners.filter((l) => l !== listener);
      }
    },
  );

  const originalInnerWidth = window.innerWidth;
  const originalMatchMedia = window.matchMedia;

  beforeEach(() => {
    listeners = [];
    vi.clearAllMocks();

    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: addEventListenerMock,
      removeEventListener: removeEventListenerMock,
      dispatchEvent: vi.fn(),
    }));
  });

  afterEach(() => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
    window.matchMedia = originalMatchMedia;
  });

  const setWindowWidth = (width: number) => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: width,
    });
  };

  it("should return true when window.innerWidth is less than 768px", () => {
    setWindowWidth(500);
    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(true);
    expect(window.matchMedia).toHaveBeenCalledWith("(max-width: 767px)");
  });

  it("should return false when window.innerWidth is 768px or greater", () => {
    setWindowWidth(768);
    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(false);

    setWindowWidth(1024);
    const { result: desktopResult } = renderHook(() => useIsMobile());
    expect(desktopResult.current).toBe(false);
  });

  it("should update state when window matchMedia change event triggers", () => {
    setWindowWidth(1020);
    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(false);

    // Simulate viewport resize to mobile
    act(() => {
      setWindowWidth(500);
      listeners.forEach((listener) => listener({} as MediaQueryListEvent));
    });

    expect(result.current).toBe(true);

    // Simulate viewport resize back to desktop
    act(() => {
      setWindowWidth(800);
      listeners.forEach((listener) => listener({} as MediaQueryListEvent));
    });

    expect(result.current).toBe(false);
  });

  it("should remove event listener on unmount", () => {
    setWindowWidth(500);
    const { unmount } = renderHook(() => useIsMobile());

    expect(addEventListenerMock).toHaveBeenCalledWith("change", expect.any(Function));

    unmount();

    expect(removeEventListenerMock).toHaveBeenCalledWith("change", expect.any(Function));
  });
});
