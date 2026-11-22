import { QueryClient } from "@tanstack/react-query";
import { createMemoryHistory, createRouter, RouterProvider } from "@tanstack/react-router";
import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DISCLAIMER, TRADE_IDEAS_URL } from "@/config";
import { INSIGHT_THEMES, LIBRARY, articleSlug } from "@/data/insights";
import retiredSlugs from "@/data/retiredSlugs.json";
import { jsonp } from "@/lib/jsonp";
import { routeTree } from "@/routeTree.gen";
import { getRouter } from "@/router";

// Rendering whole pages is slow on a busy CI runner.
vi.setConfig({ testTimeout: 30_000 });

vi.mock("@/lib/jsonp", () => ({ jsonp: vi.fn() }));

const jsonpMock = vi.mocked(jsonp);
const fetchMock = vi.fn();

beforeEach(() => {
  jsonpMock.mockReset();
  jsonpMock.mockReturnValue(new Promise(() => {}));
  fetchMock.mockReset();
  fetchMock.mockReturnValue(new Promise(() => {}));
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

async function open(path: string) {
  const router = createRouter({
    routeTree,
    context: { queryClient: new QueryClient({ defaultOptions: { queries: { retry: false } } }) },
    history: createMemoryHistory({ initialEntries: [path] }),
  });
  await router.load();
  const view = render(<RouterProvider router={router} />);
  return { router, ...view };
}

const tradeRows = () =>
  Array.from(document.querySelector("table")!.querySelectorAll<HTMLElement>("tbody tr"));
const h1 = () => screen.getByRole("heading", { level: 1 });

describe("getRouter", () => {
  it("builds a router with a query client in context and the app routes", () => {
    const router = getRouter();
    expect(router.options.context.queryClient).toBeInstanceOf(QueryClient);
    expect(router.options.scrollRestoration).toBe(true);
    expect(router.options.defaultPreloadStaleTime).toBe(0);
    expect(router.options.defaultViewTransition).toBe(true);
    expect(router.matchRoutes("/about").at(-1)?.routeId).toBe("/about");
  });

  it("gives each router its own query client", () => {
    expect(getRouter().options.context.queryClient).not.toBe(
      getRouter().options.context.queryClient,
    );
  });
});

describe("root layout", () => {
  it("wraps pages in the header, main landmark and footer", async () => {
    await open("/about");
    expect(screen.getByRole("link", { name: "VertiStrat home" })).toBeInTheDocument();
    expect(screen.getByRole("main")).toHaveAttribute("id", "main");
    expect(screen.getByRole("navigation", { name: "Footer" })).toBeInTheDocument();
  });

  it("shows the talk-to-us strip on every page except the home page", async () => {
    const home = await open("/");
    expect(screen.queryByRole("region", { name: "Talk to our team" })).toBeNull();
    home.unmount();
    await open("/about");
    expect(screen.getByRole("region", { name: "Talk to our team" })).toBeInTheDocument();
  });

  it("shows a 404 page with a way home for unknown paths", async () => {
    await open("/no-such-page");
    expect(screen.getByRole("heading", { name: "404" })).toBeInTheDocument();
    expect(screen.getByText("This page doesn't exist.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Go home" })).toHaveAttribute("href", "/");
  });
});

describe("static pages", () => {
  it.each(["/", "/about", "/manufacturing", "/it-services", "/biofuels-energy"])(
    "%s renders a single page heading",
    async (path) => {
      await open(path);
      expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    },
  );

  it("the home page offers the contact section and the contact details", async () => {
    await open("/");
    expect(document.getElementById("contact")).not.toBeNull();
    expect(
      screen.getAllByRole("link", { name: /contact@vertistratsolution\.com/ }).length,
    ).toBeGreaterThan(0);
  });
});

describe("/insights", () => {
  it("lists every theme and the article library, and loads the blog feed", async () => {
    await open("/insights");
    expect(h1()).toHaveTextContent("Vertistrat Insights");
    const nav = screen.getByRole("navigation", { name: "Themes" });
    for (const t of INSIGHT_THEMES) {
      expect(
        within(nav).getByRole("link", { name: new RegExp(t.theme.replace(/[&()]/g, "\\$&")) }),
      ).toHaveAttribute("href", `#${t.slug}`);
    }
    expect(within(nav).getByRole("link", { name: /Full library/ })).toHaveTextContent(
      `${LIBRARY.length} articles`,
    );
    await waitFor(() => expect(jsonpMock).toHaveBeenCalled());
    expect(fetchMock).toHaveBeenCalled();
  });

  it("links key articles to their insight pages", async () => {
    await open("/insights");
    const item = INSIGHT_THEMES[0]!.items[0]!;
    const link = screen
      .getAllByRole("link")
      .find((a) => a.getAttribute("href") === `/insights/${articleSlug(item.url)}`);
    expect(link).toBeDefined();
  });
});

describe("/insights/$slug", () => {
  const article = INSIGHT_THEMES[0]!.items[0]!;
  const slug = articleSlug(article.url);

  it("renders the article header and a loading state while the post loads", async () => {
    await open(`/insights/${slug}`);
    expect(h1()).toHaveTextContent(article.title);
    expect(screen.getByRole("status", { name: "Loading article" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "← Insights" })).toHaveAttribute("href", "/insights");
    expect(document.querySelector("article p.label-mono")).toHaveTextContent(
      INSIGHT_THEMES[0]!.theme,
    );
    expect(screen.getByRole("link", { name: /Originally published/ })).toHaveAttribute(
      "href",
      article.url,
    );
  });

  it("requests the post by id from the blog feed and shows its body", async () => {
    jsonpMock.mockResolvedValue({ entry: { content: { $t: "<p>Post body text</p>" } } });
    await open(`/insights/${slug}`);
    await waitFor(() => expect(document.querySelector("[data-post-body]")).not.toBeNull());
    expect(jsonpMock.mock.calls[0]![0]).toContain(`/${article.postId}?alt=json-in-script`);
    await waitFor(() =>
      expect(document.querySelector("[data-post-body]")!.shadowRoot!.textContent).toContain(
        "Post body text",
      ),
    );
  });

  it("shows an alert with a link to the original when the post cannot be loaded", async () => {
    jsonpMock.mockRejectedValue(new Error("Feed failed"));
    await open(`/insights/${slug}`);
    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("Couldn't load the article here.");
    expect(within(alert).getByRole("link")).toHaveAttribute("href", article.url);
  });

  it("treats a feed entry with no content as a load failure", async () => {
    jsonpMock.mockResolvedValue({ entry: {} });
    await open(`/insights/${slug}`);
    expect(await screen.findByRole("alert")).toBeInTheDocument();
  });

  it("suggests up to three other articles from the same theme", async () => {
    await open(`/insights/${slug}`);
    const related = screen.getByRole("region", { name: "Related articles" });
    const links = within(related).getAllByRole("link");
    expect(links).toHaveLength(3);
    expect(links.map((a) => a.getAttribute("href"))).not.toContain(`/insights/${slug}`);
  });

  it("shows a 404 for an unknown slug", async () => {
    await open("/insights/this-article-does-not-exist");
    expect(screen.getByRole("heading", { name: "404" })).toBeInTheDocument();
    expect(
      within(screen.getByRole("main")).getByRole("link", { name: /Insights/ }),
    ).toHaveAttribute("href", "/insights");
  });

  it("redirects a retired slug to the post that replaced it", async () => {
    const [oldSlug, target] = Object.entries(retiredSlugs as Record<string, string | null>).find(
      ([, t]) => t && LIBRARY.some((a) => articleSlug(a.url) === t),
    )!;
    const { router } = await open(`/insights/${oldSlug}`);
    expect(router.state.location.pathname).toBe(`/insights/${target}`);
    expect(h1()).toBeInTheDocument();
  });

  it("issues a permanent (301) redirect from the loader for a retired slug", async () => {
    const [oldSlug, target] = Object.entries(retiredSlugs as Record<string, string | null>).find(
      ([, t]) => t && LIBRARY.some((a) => articleSlug(a.url) === t),
    )!;
    const { router } = await open("/about");
    const route = router.routesById["/insights/$slug"] as unknown as {
      options: { loader: (ctx: { params: { slug: string } }) => unknown };
    };
    let thrown: unknown;
    try {
      route.options.loader({ params: { slug: oldSlug } });
    } catch (e) {
      thrown = e;
    }
    expect(thrown).toBeInstanceOf(Response);
    expect((thrown as Response).status).toBe(301);
    expect(JSON.stringify((thrown as { options?: unknown }).options)).toContain(target!);
  });

  it("suggests up to three same-theme articles for a library article that is not curated", async () => {
    const curated = new Set(INSIGHT_THEMES.flatMap((t) => t.items.map((i) => i.url)));
    const candidate = LIBRARY.find(
      (a) =>
        !curated.has(a.url) &&
        LIBRARY.filter((b) => b.theme === a.theme && b.url !== a.url).length >= 4,
    )!;
    await open(`/insights/${articleSlug(candidate.url)}`);
    const related = screen.getByRole("region", { name: "Related articles" });
    const links = within(related).getAllByRole("link");
    expect(links).toHaveLength(3);
    const sameTheme = LIBRARY.filter((b) => b.theme === candidate.theme && b.url !== candidate.url)
      .slice(0, 3)
      .map((b) => `/insights/${articleSlug(b.url)}`);
    expect(links.map((a) => a.getAttribute("href"))).toEqual(sameTheme);
  });

  it("shows a 404 for a retired slug with no replacement", async () => {
    const entry = Object.entries(retiredSlugs as Record<string, string | null>).find(([, t]) => !t);
    if (!entry) return;
    await open(`/insights/${entry[0]}`);
    expect(screen.getByRole("heading", { name: "404" })).toBeInTheDocument();
  });

  it("builds page metadata from the article, marking it as an article", async () => {
    const { router } = await open(`/insights/${slug}`);
    const route = router.routesById["/insights/$slug"] as unknown as {
      options: {
        head: (ctx: { loaderData?: unknown }) => {
          meta: Array<Record<string, string>>;
          links?: unknown[];
        };
      };
    };
    const head = route.options.head({ loaderData: article });
    expect(head.meta).toContainEqual({ property: "og:type", content: "article" });
    expect(head.meta).toContainEqual({ title: `${article.title} | VertiStrat Solutions LLP` });
    expect(head.links).toEqual([{ rel: "canonical", href: article.url }]);
    const missing = route.options.head({});
    expect(missing.meta).toContainEqual({ name: "robots", content: "noindex" });
  });
});

describe("/trade-ideas", () => {
  it("states the disclaimer and shows the placeholder notice while the data URL is unset", async () => {
    await open("/trade-ideas");
    expect(h1()).toHaveTextContent("Trade ideas");
    expect(screen.getByRole("note")).toHaveTextContent(DISCLAIMER);
    expect(TRADE_IDEAS_URL).toContain("REPLACE_REPO");
    expect(screen.getByText("No trade ideas published.")).toBeInTheDocument();
    expect(screen.getByText("The URL is still a placeholder.")).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("includes the biogas FOM register", async () => {
    await open("/trade-ideas");
    expect(document.getElementById("biogas-fom")).not.toBeNull();
  });

  describe("sample data", () => {
    const rowsText = () => tradeRows().map((r) => r.textContent ?? "");
    const first = () =>
      tradeRows().map((r) => r.querySelector("td")!.textContent!.replace("Sample", ""));
    const biogasStart = () => document.getElementById("biogas-fom");

    async function withSample() {
      await open("/trade-ideas");
      fireEvent.click(screen.getByLabelText("Show sample data"));
    }

    it("shows four clearly labelled sample rows", async () => {
      await withSample();
      expect(screen.getByText("Sample data, not a recommendation")).toBeInTheDocument();
      const table = screen.getByRole("table", { name: /sample data/ });
      expect(within(table).getAllByRole("row")).toHaveLength(5);
      expect(biogasStart()).not.toBeNull();
      expect(within(table).getAllByText("Sample")).toHaveLength(4);
    });

    it("formats prices with Indian grouping and a dash for missing prices", async () => {
      await withSample();
      const hold = rowsText().find((t) => t.includes("SAMPLE-B"))!;
      expect(hold).toContain("—");
      const buy = rowsText().find((t) => t.includes("SAMPLE-C"))!;
      expect(buy).toContain("250");
      expect(buy).toContain("290");
      expect(buy).toContain("235");
    });

    it("shows the data date but never flags sample data as stale", async () => {
      await withSample();
      expect(screen.getByText(/As of 5 Jan 2026/)).toBeInTheDocument();
      expect(screen.queryByText(/Stale/)).toBeNull();
    });

    it("filters by action", async () => {
      await withSample();
      fireEvent.change(screen.getByLabelText("Action"), { target: { value: "BUY" } });
      expect(first()).toEqual(["SAMPLE-C"]);
      fireEvent.change(screen.getByLabelText("Action"), { target: { value: "ALL" } });
      expect(first()).toHaveLength(4);
    });

    it("filters by exchange, with exchanges sorted and de-duplicated", async () => {
      await withSample();
      const options = Array.from(
        (screen.getByLabelText("Exchange") as HTMLSelectElement).options,
      ).map((o) => o.value);
      expect(options).toEqual(["ALL", "BSE", "NASDAQ", "NSE"]);
      fireEvent.change(screen.getByLabelText("Exchange"), { target: { value: "NSE" } });
      expect(first().sort()).toEqual(["SAMPLE-A", "SAMPLE-C"]);
    });

    it("resets the exchange filter when sample data is toggled", async () => {
      await withSample();
      fireEvent.change(screen.getByLabelText("Exchange"), { target: { value: "BSE" } });
      fireEvent.click(screen.getByLabelText("Show sample data"));
      expect((screen.getByLabelText("Exchange") as HTMLSelectElement).value).toBe("ALL");
    });

    it("says nothing is published when the filters match no row", async () => {
      await withSample();
      fireEvent.change(screen.getByLabelText("Action"), { target: { value: "SELL" } });
      fireEvent.change(screen.getByLabelText("Exchange"), { target: { value: "BSE" } });
      expect(screen.getByText("No trade ideas published.")).toBeInTheDocument();
    });

    it("sorts by date, newest first, then toggles direction per column", async () => {
      await withSample();
      const sortButton = (name: string) =>
        screen.getByRole("button", { name: new RegExp(`^${name}`) });
      const header = (name: string) => sortButton(name).closest("th")!;

      expect(header("Symbol")).toHaveAttribute("aria-sort", "none");
      fireEvent.click(sortButton("Symbol"));
      expect(header("Symbol")).toHaveAttribute("aria-sort", "ascending");
      expect(sortButton("Symbol")).toHaveTextContent("Symbol ↑");
      expect(first()).toEqual(["SAMPLE-A", "SAMPLE-B", "SAMPLE-C", "SAMPLE-D"]);

      fireEvent.click(sortButton("Symbol"));
      expect(header("Symbol")).toHaveAttribute("aria-sort", "descending");
      expect(sortButton("Symbol")).toHaveTextContent("Symbol ↓");
      expect(first()).toEqual(["SAMPLE-D", "SAMPLE-C", "SAMPLE-B", "SAMPLE-A"]);

      fireEvent.click(sortButton("Action"));
      expect(header("Symbol")).toHaveAttribute("aria-sort", "none");
      expect(header("Action")).toHaveAttribute("aria-sort", "ascending");
      expect(first()).toEqual(["SAMPLE-C", "SAMPLE-B", "SAMPLE-D", "SAMPLE-A"]);
    });
  });
});

describe("page head metadata", () => {
  it.each([
    ["/about", "About"],
    ["/manufacturing", "Manufacturing"],
    ["/it-services", "IT"],
    ["/biofuels-energy", "Biofuels"],
    ["/insights", "Vertistrat Insights"],
    ["/trade-ideas", "Trade ideas"],
    ["/", "Manufacturing, IT and investment advisory"],
  ])("%s sets a canonical link and a title naming the firm", async (path, word) => {
    const router = createRouter({
      routeTree,
      context: { queryClient: new QueryClient() },
      history: createMemoryHistory({ initialEntries: [path] }),
    });
    await router.load();
    const match = router.state.matches.at(-1)!;
    const head = match.meta ?? [];
    const title = head.find((m) => m && "title" in m) as { title: string } | undefined;
    expect(title?.title).toContain(word);
    expect(title?.title).toContain("VertiStrat Solutions LLP");
    expect(match.links).toContainEqual({ rel: "canonical", href: path });
  });
});

describe("root error component", () => {
  it("reports the error and offers retry and a link home", async () => {
    const router = createRouter({
      routeTree,
      context: { queryClient: new QueryClient() },
      history: createMemoryHistory({ initialEntries: ["/about"] }),
    });
    await router.load();
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const root = router.routesById["__root__"] as unknown as {
      options: { errorComponent: (p: { error: Error; reset: () => void }) => React.ReactElement };
    };
    const ErrorComponent = root.options.errorComponent;
    const reset = vi.fn();
    const invalidate = vi.spyOn(router, "invalidate").mockResolvedValue(undefined);
    const { RouterContextProvider } = await import("@tanstack/react-router");
    const boom = new Error("render failed");
    await act(async () => {
      render(
        <RouterContextProvider router={router}>
          <ErrorComponent error={boom} reset={reset} />
        </RouterContextProvider>,
      );
    });
    expect(screen.getByText("This page didn't load")).toBeInTheDocument();
    expect(errorSpy).toHaveBeenCalledWith(boom);
    expect(screen.getByRole("link", { name: "Go home" })).toHaveAttribute("href", "/");
    fireEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(invalidate).toHaveBeenCalledTimes(1);
    expect(reset).toHaveBeenCalledTimes(1);
  });
});
