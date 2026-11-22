import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { jsonp } from "./jsonp";

const scripts = () => Array.from(document.head.querySelectorAll("script"));
const callbackOf = (script: HTMLScriptElement) =>
  new URL(script.src).searchParams.get("callback") as string;
const registry = () => window as unknown as Record<string, unknown>;

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-11-20T00:00:00Z"));
});

afterEach(() => {
  scripts().forEach((s) => s.remove());
  vi.useRealTimers();
});

describe("jsonp", () => {
  it("appends a script whose callback parameter names a global function", () => {
    void jsonp("https://blog.example/feed?alt=json-in-script").catch(() => {});
    const [script] = scripts();
    expect(script).toBeDefined();
    const callback = callbackOf(script!);
    expect(callback).toMatch(/^__vsFeed\d+_\d+$/);
    expect(typeof registry()[callback]).toBe("function");
    expect(script!.src).toBe(`https://blog.example/feed?alt=json-in-script&callback=${callback}`);
  });

  it("starts the query string with ? when the url has none", () => {
    void jsonp("https://blog.example/feed").catch(() => {});
    expect(scripts()[0]!.src).toMatch(/^https:\/\/blog\.example\/feed\?callback=__vsFeed/);
  });

  it("resolves with the callback payload, removes the script and the global", async () => {
    const promise = jsonp("https://blog.example/feed");
    const script = scripts()[0]!;
    const callback = callbackOf(script);
    (registry()[callback] as (d: unknown) => void)({ feed: { entry: [] } });
    await expect(promise).resolves.toEqual({ feed: { entry: [] } });
    expect(document.head.contains(script)).toBe(false);
    expect(callback in registry()).toBe(false);
    expect(vi.getTimerCount()).toBe(0);
  });

  it("rejects with 'Feed failed' when the script fails to load, and cleans up", async () => {
    const promise = jsonp("https://blog.example/feed");
    const script = scripts()[0]!;
    const callback = callbackOf(script);
    script.onerror?.(new Event("error"));
    await expect(promise).rejects.toThrow("Feed failed");
    expect(document.head.contains(script)).toBe(false);
    expect(callback in registry()).toBe(false);
    expect(vi.getTimerCount()).toBe(0);
  });

  it("times out after 10 seconds, not before", async () => {
    const promise = jsonp("https://blog.example/feed");
    const settled = vi.fn();
    promise.then(settled, settled);
    const script = scripts()[0]!;
    const callback = callbackOf(script);

    await vi.advanceTimersByTimeAsync(9999);
    expect(settled).not.toHaveBeenCalled();
    expect(callback in registry()).toBe(true);

    await vi.advanceTimersByTimeAsync(1);
    await expect(promise).rejects.toThrow("timeout");
    expect(document.head.contains(script)).toBe(false);
    expect(callback in registry()).toBe(false);
  });

  it("gives concurrent requests in the same millisecond different callbacks", () => {
    void jsonp("https://blog.example/a").catch(() => {});
    void jsonp("https://blog.example/b").catch(() => {});
    const [a, b] = scripts().map(callbackOf);
    expect(a).not.toBe(b);
  });

  it("does not resolve a request when another request's callback fires", async () => {
    const first = jsonp("https://blog.example/a");
    const second = jsonp("https://blog.example/b");
    const [a, b] = scripts().map(callbackOf);
    (registry()[b!] as (d: unknown) => void)("second");
    await expect(second).resolves.toBe("second");
    expect(a! in registry()).toBe(true);
    (registry()[a!] as (d: unknown) => void)("first");
    await expect(first).resolves.toBe("first");
  });
});
