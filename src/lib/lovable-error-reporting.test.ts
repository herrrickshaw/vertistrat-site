import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { reportLovableError } from "./lovable-error-reporting";

let capture: ReturnType<typeof vi.fn>;
let runtime: ReturnType<typeof vi.fn>;

beforeEach(() => {
  capture = vi.fn();
  runtime = vi.fn();
  window.__lovableEvents = { captureException: capture };
  window.__lovableReportRuntimeError = runtime;
  window.history.pushState({}, "", "/insights/some-post");
});

afterEach(() => {
  vi.unstubAllGlobals();
  delete window.__lovableEvents;
  delete window.__lovableReportRuntimeError;
});

describe("reportLovableError: captureException", () => {
  it("reports the error with route context and boundary options", () => {
    const err = new Error("render failed");
    reportLovableError(err);
    expect(capture).toHaveBeenCalledTimes(1);
    expect(capture).toHaveBeenCalledWith(
      err,
      { source: "react_error_boundary", route: "/insights/some-post" },
      { mechanism: "react_error_boundary", handled: false, severity: "error" },
    );
  });

  it("lets caller context override the defaults", () => {
    reportLovableError(new Error("x"), { route: "/custom", componentStack: "at Foo" });
    expect(capture.mock.calls[0]![1]).toEqual({
      source: "react_error_boundary",
      route: "/custom",
      componentStack: "at Foo",
    });
  });

  it("does nothing when the editor hooks are absent", () => {
    delete window.__lovableEvents;
    delete window.__lovableReportRuntimeError;
    expect(() => reportLovableError(new Error("x"))).not.toThrow();
  });

  it("tolerates an events object without captureException", () => {
    window.__lovableEvents = {};
    expect(() => reportLovableError(new Error("x"))).not.toThrow();
    expect(runtime).toHaveBeenCalledTimes(1);
  });

  it("does nothing outside a browser", () => {
    vi.stubGlobal("window", undefined);
    expect(() => reportLovableError(new Error("x"))).not.toThrow();
    expect(capture).not.toHaveBeenCalled();
    expect(runtime).not.toHaveBeenCalled();
  });
});

describe("reportLovableError: runtime error hook", () => {
  it("forwards message, stack and pathname for an Error", () => {
    const err = new Error("boom");
    err.stack = "Error: boom\n    at x";
    reportLovableError(err);
    expect(runtime).toHaveBeenCalledWith({
      message: "boom",
      stack: "Error: boom\n    at x",
      filename: "/insights/some-post",
    });
  });

  it("omits the stack key for values that are not Errors", () => {
    reportLovableError("plain text");
    const payload = runtime.mock.calls[0]![0];
    expect(payload).toEqual({ message: "plain text", filename: "/insights/some-post" });
    expect("stack" in payload).toBe(false);
  });

  it("describes a thrown Response by status and url", () => {
    const res = { status: 503, url: "https://api.example/x" };
    Object.setPrototypeOf(res, Response.prototype);
    reportLovableError(res);
    expect(runtime.mock.calls[0]![0].message).toBe("Response 503 at https://api.example/x");
  });

  it("describes a Response with no url by status only", () => {
    reportLovableError(new Response("nope", { status: 404 }));
    expect(runtime.mock.calls[0]![0].message).toBe("Response 404");
  });

  it("uses the message of a plain object", () => {
    reportLovableError({ message: "db down", code: "E1" });
    expect(runtime.mock.calls[0]![0].message).toBe("db down");
  });

  it("serialises objects without a usable message", () => {
    reportLovableError({ message: "", code: "E1" });
    expect(runtime.mock.calls[0]![0].message).toBe('{"message":"","code":"E1"}');
    reportLovableError({ message: 5 });
    expect(runtime.mock.calls[1]![0].message).toBe('{"message":5}');
    reportLovableError(42);
    expect(runtime.mock.calls[2]![0].message).toBe("42");
  });

  it("handles null and undefined without throwing", () => {
    reportLovableError(null);
    reportLovableError(undefined);
    expect(runtime.mock.calls[0]![0].message).toBe("null");
    expect(runtime.mock.calls[1]![0].message).toBe("undefined");
  });

  it("truncates long serialised payloads to 2000 characters", () => {
    reportLovableError({ blob: "x".repeat(5000) });
    expect(runtime.mock.calls[0]![0].message).toHaveLength(2000);
  });

  it("falls back to String() for values JSON cannot serialise", () => {
    const circular: Record<string, unknown> = {};
    circular["self"] = circular;
    reportLovableError(circular);
    expect(runtime.mock.calls[0]![0].message).toBe("[object Object]");
  });
});
