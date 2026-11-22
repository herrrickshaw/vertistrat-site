import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const entry = vi.hoisted(() => ({ fetch: vi.fn(), loads: 0 }));

vi.mock("@tanstack/react-start/server-entry", () => {
  return {
    get default() {
      entry.loads += 1;
      return { fetch: (...args: unknown[]) => entry.fetch(...args) };
    },
  };
});

type Server = { fetch: (r: Request, env: unknown, ctx: unknown) => Promise<Response> };

let server: Server;
let sink: ReturnType<typeof vi.fn>;
const realConsoleError = console.error;

const H3_BODY = JSON.stringify({ status: 500, unhandled: true, message: "HTTPError" });
const json = (body: string, status = 500, type: string | null = "application/json") =>
  new Response(body, { status, headers: type ? { "content-type": type } : {} });

beforeEach(async () => {
  entry.fetch.mockReset();
  entry.loads = 0;
  sink = vi.fn();
  console.error = sink as unknown as typeof console.error;
  vi.resetModules();
  await import("./lib/error-capture");
  server = (await import("./server")).default as Server;
});

afterEach(() => {
  console.error = realConsoleError;
});

const call = (req = new Request("https://vertistrat.test/")) => server.fetch(req, {}, {});

describe("server fetch: pass-through", () => {
  it("returns the handler response untouched for non-error statuses", async () => {
    const ok = new Response("hi", { status: 200 });
    entry.fetch.mockResolvedValue(ok);
    expect(await call()).toBe(ok);
    expect(sink).not.toHaveBeenCalled();
  });

  it("hands the request, env and ctx to the handler", async () => {
    entry.fetch.mockResolvedValue(new Response("x"));
    const req = new Request("https://vertistrat.test/a");
    const env = { E: 1 };
    const ctx = { C: 2 };
    await server.fetch(req, env, ctx);
    expect(entry.fetch).toHaveBeenCalledWith(req, env, ctx);
  });

  it("does not rewrite a 499 even when the body looks like the h3 error", async () => {
    const res = json(H3_BODY, 499);
    entry.fetch.mockResolvedValue(res);
    expect(await call()).toBe(res);
  });

  it("does not rewrite a 5xx that is not JSON", async () => {
    const res = json(H3_BODY, 500, "text/html");
    entry.fetch.mockResolvedValue(res);
    expect(await call()).toBe(res);
    const noType = json(H3_BODY, 500, null);
    entry.fetch.mockResolvedValue(noType);
    expect(await call()).toBe(noType);
  });

  it("does not rewrite JSON 5xx bodies that are not the h3 swallowed-error shape", async () => {
    for (const body of [
      JSON.stringify({ unhandled: true, message: "Something else" }),
      JSON.stringify({ unhandled: false, message: "HTTPError" }),
      JSON.stringify({ unhandled: "true", message: "HTTPError" }),
      JSON.stringify({ message: "HTTPError" }),
      "not json at all",
      "null",
    ]) {
      const res = json(body);
      entry.fetch.mockResolvedValue(res);
      expect(await call(), body).toBe(res);
    }
    expect(sink).not.toHaveBeenCalled();
  });

  it("matches a JSON content type that carries a charset", async () => {
    entry.fetch.mockResolvedValue(json(H3_BODY, 500, "application/json; charset=utf-8"));
    const res = await call();
    expect(res.headers.get("content-type")).toBe("text/html; charset=utf-8");
  });
});

describe("server fetch: swallowed h3 errors", () => {
  it("replaces the response with the HTML error page and status 500", async () => {
    entry.fetch.mockResolvedValue(json(H3_BODY, 503));
    const res = await call();
    expect(res.status).toBe(500);
    expect(res.headers.get("content-type")).toBe("text/html; charset=utf-8");
    expect(await res.text()).toContain("This page didn't load");
  });

  it("logs a synthetic error carrying the body when no error was captured", async () => {
    entry.fetch.mockResolvedValue(json(H3_BODY));
    await call();
    expect(sink).toHaveBeenCalledTimes(1);
    expect(String(sink.mock.calls[0]![0])).toContain(`h3 swallowed SSR error: ${H3_BODY}`);
  });

  it("logs the originally captured error instead, and consumes it", async () => {
    const original = new Error("the real cause");
    original.stack = "STACK(real cause)";
    console.error(original);
    sink.mockClear();
    entry.fetch.mockResolvedValue(json(H3_BODY));
    await call();
    expect(sink).toHaveBeenCalledTimes(1);
    expect(sink.mock.calls[0]![0]).toBe("STACK(real cause)");
  });
});

describe("server fetch: handler failures", () => {
  it("returns the HTML error page and logs when the handler throws", async () => {
    const boom = new Error("handler exploded");
    boom.stack = "STACK(handler exploded)";
    entry.fetch.mockRejectedValue(boom);
    const res = await call();
    expect(res.status).toBe(500);
    expect(res.headers.get("content-type")).toBe("text/html; charset=utf-8");
    expect(await res.text()).toContain("Try again");
    expect(sink).toHaveBeenCalledWith("STACK(handler exploded)");
  });

  it("loads the server entry once and reuses it", async () => {
    entry.fetch.mockResolvedValue(new Response("ok"));
    await call();
    await call();
    expect(entry.fetch).toHaveBeenCalledTimes(2);
    expect(entry.loads).toBe(1);
  });
});
