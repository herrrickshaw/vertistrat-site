import { QueryClient } from "@tanstack/react-query";
import { createMemoryHistory, createRouter, RouterProvider } from "@tanstack/react-router";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { formatDate } from "@/lib/feeds";
import { routeTree } from "@/routeTree.gen";

vi.setConfig({ testTimeout: 30_000 });

const URL_UNDER_TEST = "https://raw.example.test/trade_ideas.json";

vi.mock("@/config", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/config")>()),
  TRADE_IDEAS_URL: "https://raw.example.test/trade_ideas.json",
}));

const fetchMock = vi.fn();

const today = new Date().toISOString().slice(0, 10);
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString().slice(0, 10);

const idea = (symbol: string, extra: Record<string, unknown> = {}) => ({
  symbol,
  exchange: "NSE",
  action: "BUY",
  entry: 1234.5,
  target: 1500,
  stop: 1100,
  thesis: `Thesis for ${symbol}`,
  asOf: today,
  ...extra,
});

const reply = (status: number, body: unknown) =>
  fetchMock.mockResolvedValue(new Response(JSON.stringify(body), { status }));

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

async function open() {
  const router = createRouter({
    routeTree,
    context: { queryClient: new QueryClient() },
    history: createMemoryHistory({ initialEntries: ["/trade-ideas"] }),
  });
  await router.load();
  return render(<RouterProvider router={router} />);
}

const tradeTable = () => document.querySelector("table")!;
const symbols = () =>
  Array.from(tradeTable().querySelectorAll("tbody tr")).map(
    (r) => r.querySelector("td")!.textContent,
  );

describe("/trade-ideas with a configured data URL", () => {
  it("loads the JSON file without caching", async () => {
    reply(200, [idea("AAA")]);
    await open();
    await screen.findByText("AAA");
    expect(fetchMock).toHaveBeenCalledWith(URL_UNDER_TEST, { cache: "no-store" });
  });

  it("shows a loading message first", async () => {
    fetchMock.mockReturnValue(new Promise(() => {}));
    await open();
    expect(await screen.findByText("Loading…")).toBeInTheDocument();
  });

  it("renders each idea with Indian digit grouping, a dash for missing prices and the thesis", async () => {
    reply(200, [
      idea("AAA", { entry: 1234567.5, target: null, thesis: "Because" }),
      idea("BBB", { action: "SELL" }),
    ]);
    await open();
    await screen.findByText("AAA");
    const row = within(screen.getByText("AAA").closest("tr")!);
    expect(row.getByText("12,34,567.5")).toBeInTheDocument();
    expect(row.getByText("—")).toBeInTheDocument();
    expect(row.getByText("Because")).toBeInTheDocument();
    expect(row.getByText("BUY")).toHaveClass("bg-success");
    expect(within(screen.getByText("BBB").closest("tr")!).getByText("SELL")).toHaveClass(
      "bg-destructive",
    );
  });

  it("shows an empty-state message when the file does not exist (404)", async () => {
    reply(404, {});
    await open();
    expect(await screen.findByText("No trade ideas published.")).toBeInTheDocument();
    expect(screen.queryByText("The URL is still a placeholder.")).toBeNull();
    expect(screen.queryByText(/Couldn't load the trade ideas file/)).toBeNull();
  });

  it("shows an error notice for other HTTP failures", async () => {
    reply(500, {});
    await open();
    expect(await screen.findByText(/Couldn't load the trade ideas file/)).toBeInTheDocument();
  });

  it("shows the error notice when the file is not a JSON array", async () => {
    reply(200, { not: "an array" });
    await open();
    expect(await screen.findByText(/Couldn't load the trade ideas file/)).toBeInTheDocument();
  });

  it("drops rows with an unknown action", async () => {
    reply(200, [idea("AAA"), idea("BAD", { action: "MAYBE" })]);
    await open();
    await screen.findByText("AAA");
    expect(symbols()).toEqual(["AAA"]);
  });

  it("states the latest as-of date and does not flag fresh data as stale", async () => {
    reply(200, [idea("AAA", { asOf: daysAgo(3) }), idea("BBB", { asOf: daysAgo(30) })]);
    await open();
    await screen.findByText("AAA");
    expect(
      screen.getByText(`As of ${formatDate(daysAgo(3))}`, { exact: false }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/Stale/)).toBeNull();
  });

  it("flags data whose newest row is older than 7 days", async () => {
    reply(200, [idea("AAA", { asOf: daysAgo(8) }), idea("BBB", { asOf: daysAgo(40) })]);
    await open();
    expect(await screen.findByText("Stale: older than 7 days")).toBeInTheDocument();
  });

  it("does not flag data from 6 days ago", async () => {
    reply(200, [idea("AAA", { asOf: daysAgo(6) })]);
    await open();
    await screen.findByText("AAA");
    expect(screen.queryByText(/Stale/)).toBeNull();
  });

  it("lists the newest first by default", async () => {
    reply(200, [
      idea("OLD", { asOf: daysAgo(5) }),
      idea("NEW", { asOf: daysAgo(1) }),
      idea("MID", { asOf: daysAgo(3) }),
    ]);
    await open();
    await screen.findByText("OLD");
    expect(symbols()).toEqual(["NEW", "MID", "OLD"]);
  });

  it("ignores sample data for the as-of line and staleness once sample mode is on", async () => {
    reply(200, [idea("AAA", { asOf: daysAgo(30) })]);
    await open();
    expect(await screen.findByText("Stale: older than 7 days")).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText("Show sample data"));
    expect(screen.queryByText(/Stale/)).toBeNull();
    expect(symbols().every((s) => s!.startsWith("SAMPLE"))).toBe(true);
  });

  it("filters the loaded rows by action and exchange", async () => {
    reply(200, [
      idea("AAA", { action: "BUY", exchange: "NSE" }),
      idea("BBB", { action: "SELL", exchange: "BSE" }),
      idea("CCC", { action: "BUY", exchange: "BSE" }),
    ]);
    await open();
    await screen.findByText("AAA");
    fireEvent.change(screen.getByLabelText("Action"), { target: { value: "BUY" } });
    expect(symbols().sort()).toEqual(["AAA", "CCC"]);
    fireEvent.change(screen.getByLabelText("Exchange"), { target: { value: "BSE" } });
    expect(symbols()).toEqual(["CCC"]);
    await waitFor(() => expect(screen.getByLabelText("Exchange")).toHaveValue("BSE"));
  });
});
