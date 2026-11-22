import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

type Mod = typeof import("./error-capture");

let mod: Mod;
let sink: ReturnType<typeof vi.fn>;
const realConsoleError = console.error;

function errorWithStack(message: string, stack = `STACK(${message})`): Error {
  const e = new Error(message);
  e.stack = stack;
  return e;
}

beforeEach(async () => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-11-20T00:00:00Z"));
  sink = vi.fn();
  console.error = sink as unknown as typeof console.error;
  vi.resetModules();
  mod = await import("./error-capture");
});

afterEach(() => {
  console.error = realConsoleError;
  vi.useRealTimers();
});

describe("describeError", () => {
  it("returns a string as is", () => {
    expect(mod.describeError("plain")).toBe("plain");
  });

  it("returns an empty string for null and undefined", () => {
    expect(mod.describeError(null)).toBe("");
    expect(mod.describeError(undefined)).toBe("");
  });

  it("serialises plain objects as JSON", () => {
    expect(mod.describeError({ a: 1 })).toBe('{"a":1}');
  });

  it("falls back to String() when the value cannot be serialised", () => {
    const circular: Record<string, unknown> = {};
    circular["self"] = circular;
    expect(mod.describeError(circular)).toBe("[object Object]");
    expect(mod.describeError(() => 1)).toBe("() => 1");
  });

  it("uses the stack when present, and name: message when the stack is missing", () => {
    expect(mod.describeError(errorWithStack("boom"))).toBe("STACK(boom)");
    const bare = new TypeError("bad");
    Object.defineProperty(bare, "stack", { value: undefined });
    expect(mod.describeError(bare)).toBe("TypeError: bad");
  });

  it("appends a numeric status or statusCode and ignores other types", () => {
    const a = Object.assign(errorWithStack("a"), { status: 404 });
    const b = Object.assign(errorWithStack("b"), { statusCode: 502 });
    const both = Object.assign(errorWithStack("c"), { status: 400, statusCode: 500 });
    const zero = Object.assign(errorWithStack("z"), { status: 0 });
    const text = Object.assign(errorWithStack("d"), { status: "404" });
    expect(mod.describeError(a)).toBe("STACK(a) (status 404)");
    expect(mod.describeError(b)).toBe("STACK(b) (status 502)");
    expect(mod.describeError(both)).toBe("STACK(c) (status 400)");
    expect(mod.describeError(zero)).toBe("STACK(z) (status 0)");
    expect(mod.describeError(text)).toBe("STACK(d)");
  });

  it("walks the cause chain with a 'caused by' label and ends on a non-Error cause", () => {
    const root = errorWithStack("root");
    const mid = new Error("mid", { cause: root });
    mid.stack = "STACK(mid)";
    const top = new Error("top", { cause: mid });
    top.stack = "STACK(top)";
    expect(mod.describeError(top)).toBe(
      "STACK(top)\ncaused by: STACK(mid)\ncaused by: STACK(root)",
    );
    const withString = new Error("x", { cause: "just text" });
    withString.stack = "STACK(x)";
    expect(mod.describeError(withString)).toBe("STACK(x)\njust text");
  });

  it("follows at most 5 links of the cause chain", () => {
    let e: Error = errorWithStack("e7");
    for (let i = 6; i >= 1; i--) {
      const next = new Error(`e${i}`, { cause: e });
      next.stack = `STACK(e${i})`;
      e = next;
    }
    const lines = mod.describeError(e).split("\n");
    expect(lines).toHaveLength(5);
    expect(lines[0]).toBe("STACK(e1)");
    expect(lines[4]).toBe("caused by: STACK(e5)");
  });

  it("truncates the description to 8000 characters", () => {
    expect(mod.describeError("x".repeat(8000))).toHaveLength(8000);
    expect(mod.describeError("x".repeat(8001))).toHaveLength(8000);
    expect(mod.describeError("x".repeat(7999))).toHaveLength(7999);
  });
});

describe("console.error wrapper", () => {
  it("expands Error arguments to strings and passes other arguments through", () => {
    const err = errorWithStack("kaput");
    const obj = { k: 1 };
    console.error("label", err, obj, 7);
    expect(sink).toHaveBeenCalledTimes(1);
    expect(sink).toHaveBeenCalledWith("label", "STACK(kaput)", obj, 7);
  });

  it("records the last Error so it can be consumed exactly once", () => {
    const err = errorWithStack("first");
    console.error(err);
    expect(mod.consumeLastCapturedError()).toBe(err);
    expect(mod.consumeLastCapturedError()).toBeUndefined();
  });

  it("keeps only the most recent Error", () => {
    const one = errorWithStack("one");
    const two = errorWithStack("two");
    console.error(one);
    console.error(two);
    expect(mod.consumeLastCapturedError()).toBe(two);
  });

  it("does not record non-Error arguments", () => {
    console.error("just a string", { a: 1 });
    expect(mod.consumeLastCapturedError()).toBeUndefined();
  });
});

describe("consumeLastCapturedError", () => {
  it("returns undefined when nothing was captured", () => {
    expect(mod.consumeLastCapturedError()).toBeUndefined();
  });

  it("returns the error up to 5 seconds later and forgets it after that", () => {
    const err = errorWithStack("ttl");
    console.error(err);
    vi.advanceTimersByTime(5000);
    expect(mod.consumeLastCapturedError()).toBe(err);

    console.error(err);
    vi.advanceTimersByTime(5001);
    expect(mod.consumeLastCapturedError()).toBeUndefined();
    expect(mod.consumeLastCapturedError()).toBeUndefined();
  });
});

describe("global listeners", () => {
  it("records the error carried by an error event", () => {
    const err = errorWithStack("window error");
    globalThis.dispatchEvent(new ErrorEvent("error", { error: err }));
    expect(mod.consumeLastCapturedError()).toBe(err);
  });

  it("records the event itself when an error event carries no error", () => {
    const event = new ErrorEvent("error", { message: "script error" });
    globalThis.dispatchEvent(event);
    expect(mod.consumeLastCapturedError()).toBe(event);
  });

  it("records the reason of an unhandled rejection", () => {
    const reason = errorWithStack("rejected");
    const event = Object.assign(new Event("unhandledrejection"), { reason });
    globalThis.dispatchEvent(event);
    expect(mod.consumeLastCapturedError()).toBe(reason);
  });
});
