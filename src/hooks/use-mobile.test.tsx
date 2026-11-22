import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useIsMobile } from "./use-mobile";

let listeners: Array<() => void>;
let add: ReturnType<typeof vi.fn>;
let remove: ReturnType<typeof vi.fn>;
let queries: string[];
const realMatchMedia = window.matchMedia;
const realWidth = window.innerWidth;

function setWidth(w: number) {
  Object.defineProperty(window, "innerWidth", { configurable: true, writable: true, value: w });
}

beforeEach(() => {
  listeners = [];
  queries = [];
  add = vi.fn((_type: string, fn: () => void) => listeners.push(fn));
  remove = vi.fn();
  window.matchMedia = ((q: string) => {
    queries.push(q);
    return { matches: false, addEventListener: add, removeEventListener: remove };
  }) as unknown as typeof window.matchMedia;
});

afterEach(() => {
  window.matchMedia = realMatchMedia;
  setWidth(realWidth);
});

describe("useIsMobile", () => {
  it("is true below 768px and false at 768px and above", () => {
    setWidth(767);
    expect(renderHook(() => useIsMobile()).result.current).toBe(true);
    setWidth(768);
    expect(renderHook(() => useIsMobile()).result.current).toBe(false);
    setWidth(1280);
    expect(renderHook(() => useIsMobile()).result.current).toBe(false);
  });

  it("queries the media list for widths up to 767px", () => {
    setWidth(500);
    renderHook(() => useIsMobile());
    expect(queries).toEqual(["(max-width: 767px)"]);
  });

  it("updates when the media query changes", () => {
    setWidth(1024);
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
    act(() => {
      setWidth(600);
      listeners.forEach((fn) => fn());
    });
    expect(result.current).toBe(true);
    act(() => {
      setWidth(768);
      listeners.forEach((fn) => fn());
    });
    expect(result.current).toBe(false);
  });

  it("subscribes to the change event and unsubscribes the same handler on unmount", () => {
    setWidth(1024);
    const { unmount } = renderHook(() => useIsMobile());
    expect(add).toHaveBeenCalledTimes(1);
    expect(add.mock.calls[0]![0]).toBe("change");
    unmount();
    expect(remove).toHaveBeenCalledTimes(1);
    expect(remove).toHaveBeenCalledWith("change", add.mock.calls[0]![1]);
  });
});
