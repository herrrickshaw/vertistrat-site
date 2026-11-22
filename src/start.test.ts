import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

type Next = () => Promise<unknown>;
type MiddlewareFn = (ctx: { next: Next }) => Promise<unknown>;

const state = vi.hoisted(() => ({
  server: undefined as undefined | ((ctx: { next: () => Promise<unknown> }) => Promise<unknown>),
  csrf: undefined as undefined | { filter: (ctx: { handlerType: string }) => boolean },
  start: undefined as undefined | (() => { requestMiddleware: unknown[] }),
}));

vi.mock("@tanstack/react-start", () => ({
  createMiddleware: () => ({
    server: (fn: MiddlewareFn) => {
      state.server = fn;
      return { kind: "error-middleware" };
    },
  }),
  createCsrfMiddleware: (opts: { filter: (ctx: { handlerType: string }) => boolean }) => {
    state.csrf = opts;
    return { kind: "csrf-middleware" };
  },
  createStart: (factory: () => { requestMiddleware: unknown[] }) => {
    state.start = factory;
    return { kind: "start-instance" };
  },
}));

let sink: ReturnType<typeof vi.spyOn>;

beforeEach(async () => {
  sink = vi.spyOn(console, "error").mockImplementation(() => {});
  vi.resetModules();
  await import("./start");
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("start instance", () => {
  it("installs the error middleware before the CSRF middleware", () => {
    expect(state.start!().requestMiddleware).toEqual([
      { kind: "error-middleware" },
      { kind: "csrf-middleware" },
    ]);
  });

  it("applies CSRF protection to server functions only", () => {
    expect(state.csrf!.filter({ handlerType: "serverFn" })).toBe(true);
    expect(state.csrf!.filter({ handlerType: "router" })).toBe(false);
    expect(state.csrf!.filter({ handlerType: "" })).toBe(false);
  });
});

describe("error middleware", () => {
  it("returns whatever the next handler returns", async () => {
    const result = { ok: true };
    expect(await state.server!({ next: async () => result })).toBe(result);
    expect(sink).not.toHaveBeenCalled();
  });

  it("rethrows errors that carry a statusCode (redirects, not-found, HTTP errors)", async () => {
    const withStatus = Object.assign(new Error("nope"), { statusCode: 404 });
    await expect(
      state.server!({
        next: async () => {
          throw withStatus;
        },
      }),
    ).rejects.toBe(withStatus);
    const plainObject = { statusCode: 302 };
    await expect(
      state.server!({
        next: async () => {
          throw plainObject;
        },
      }),
    ).rejects.toBe(plainObject);
    expect(sink).not.toHaveBeenCalled();
  });

  it("turns other errors into a logged 500 HTML page", async () => {
    const boom = new Error("unexpected");
    const res = (await state.server!({
      next: async () => {
        throw boom;
      },
    })) as Response;
    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(500);
    expect(res.headers.get("content-type")).toBe("text/html; charset=utf-8");
    expect(await res.text()).toContain("This page didn't load");
    expect(sink).toHaveBeenCalledWith(boom);
  });

  it("also handles thrown values that are not objects", async () => {
    for (const thrown of [null, undefined, "text", 42]) {
      const res = (await state.server!({
        next: async () => {
          throw thrown;
        },
      })) as Response;
      expect(res.status, String(thrown)).toBe(500);
    }
    expect(sink).toHaveBeenCalledTimes(4);
  });
});
