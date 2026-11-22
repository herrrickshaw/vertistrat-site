import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { BLOG_FEED_URL, BLOG_URL, GITHUB_REPOS_URL, GITHUB_USER } from "@/config";
import { jsonp } from "@/lib/jsonp";
import { ArticleGrid, GithubRepos } from "./Feeds";

vi.mock("@/lib/jsonp", () => ({ jsonp: vi.fn() }));

const jsonpMock = vi.mocked(jsonp);

function entry(n: number, categories: string[] = [], extra: Record<string, unknown> = {}) {
  return {
    id: { $t: `id-${n}` },
    title: { $t: `Article ${n}` },
    published: { $t: "2026-08-01T10:00:00Z" },
    link: [{ rel: "alternate", href: `https://blog.vertistratsolution.com/p${n}.html` }],
    category: categories.map((term) => ({ term })),
    content: { $t: `<p>Excerpt ${n}</p>` },
    ...extra,
  };
}

function wrap(ui: React.ReactElement) {
  const client = new QueryClient();
  // Retry immediately so the failing-feed path does not wait a second.
  client.setQueryDefaults(["blog"], { retryDelay: 0 });
  return render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>);
}

beforeEach(() => {
  jsonpMock.mockReset();
});

describe("ArticleGrid", () => {
  it("requests the blog feed as JSONP", async () => {
    jsonpMock.mockResolvedValue({ feed: { entry: [] } });
    wrap(<ArticleGrid />);
    await screen.findByText(/No articles yet/);
    expect(jsonpMock).toHaveBeenCalledTimes(1);
    expect(jsonpMock).toHaveBeenCalledWith(BLOG_FEED_URL.replace("alt=json", "alt=json-in-script"));
    expect(jsonpMock.mock.calls[0]![0]).toContain("alt=json-in-script");
  });

  it("shows a loading skeleton of six cards by default, or `limit` cards", () => {
    jsonpMock.mockReturnValue(new Promise(() => {}));
    const { unmount } = wrap(<ArticleGrid />);
    expect(screen.getByLabelText("Loading")).toHaveAttribute("aria-busy", "true");
    expect(within(screen.getByLabelText("Loading")).getAllByRole("listitem")).toHaveLength(6);
    unmount();
    wrap(<ArticleGrid limit={2} />);
    expect(within(screen.getByLabelText("Loading")).getAllByRole("listitem")).toHaveLength(2);
  });

  it("renders article cards with title, excerpt, date and first category", async () => {
    jsonpMock.mockResolvedValue({ feed: { entry: [entry(1, ["Energy", "Trade"])] } });
    wrap(<ArticleGrid />);
    const link = await screen.findByRole("link", { name: /Article 1/ });
    expect(link).toHaveAttribute("href", "https://blog.vertistratsolution.com/p1.html");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    expect(within(link).getByText("Excerpt 1")).toBeInTheDocument();
    expect(within(link).getByText("1 Aug 2026 · Energy")).toBeInTheDocument();
    expect(within(link).getByText("(opens in new tab)")).toBeInTheDocument();
  });

  it("omits the category separator when the article has no category", async () => {
    jsonpMock.mockResolvedValue({ feed: { entry: [entry(1)] } });
    wrap(<ArticleGrid />);
    expect(await screen.findByText("1 Aug 2026")).toBeInTheDocument();
  });

  it("shows the thumbnail when there is one and a placeholder block otherwise", async () => {
    jsonpMock.mockResolvedValue({
      feed: {
        entry: [entry(1, [], { media$thumbnail: { url: "https://img/s72-c/a.png" } }), entry(2)],
      },
    });
    const { container } = wrap(<ArticleGrid />);
    await screen.findByText("Article 1");
    const imgs = container.querySelectorAll("img");
    expect(imgs).toHaveLength(1);
    expect(imgs[0]).toHaveAttribute("src", "https://img/w600-h340-c/a.png");
    expect(imgs[0]).toHaveAttribute("alt", "");
    expect(imgs[0]).toHaveAttribute("loading", "lazy");
    expect(container.querySelectorAll("a [aria-hidden='true'].bg-muted")).toHaveLength(1);
  });

  it("limits the number of cards", async () => {
    jsonpMock.mockResolvedValue({ feed: { entry: [entry(1), entry(2), entry(3)] } });
    wrap(<ArticleGrid limit={2} />);
    await screen.findByText("Article 1");
    expect(screen.getAllByRole("link")).toHaveLength(2);
    expect(screen.queryByText("Article 3")).toBeNull();
  });

  it("shows every article when no limit is given", async () => {
    jsonpMock.mockResolvedValue({ feed: { entry: [1, 2, 3, 4, 5, 6, 7].map((n) => entry(n)) } });
    wrap(<ArticleGrid />);
    await screen.findByText("Article 1");
    expect(screen.getAllByRole("link")).toHaveLength(7);
  });

  it("shows a notice linking to the blog when the feed is empty", async () => {
    jsonpMock.mockResolvedValue({ feed: { entry: [] } });
    wrap(<ArticleGrid />);
    const notice = await screen.findByRole("status");
    expect(notice).toHaveTextContent("No articles yet.");
    expect(within(notice).getByRole("link", { name: "Visit the blog" })).toHaveAttribute(
      "href",
      BLOG_URL,
    );
  });

  it("shows a notice linking to the blog after the feed fails twice", async () => {
    jsonpMock.mockRejectedValue(new Error("Feed failed"));
    wrap(<ArticleGrid />);
    const notice = await screen.findByText(/couldn't load the latest articles/);
    expect(jsonpMock).toHaveBeenCalledTimes(2);
    expect(within(notice.closest("div")!).getByRole("link")).toHaveAttribute("href", BLOG_URL);
  });

  it("recovers when the retry succeeds", async () => {
    jsonpMock
      .mockRejectedValueOnce(new Error("blip"))
      .mockResolvedValueOnce({ feed: { entry: [entry(1)] } });
    wrap(<ArticleGrid />);
    expect(await screen.findByText("Article 1")).toBeInTheDocument();
    expect(jsonpMock).toHaveBeenCalledTimes(2);
  });

  describe("category filter", () => {
    const feed = {
      feed: {
        entry: [entry(1, ["Trade", "Energy"]), entry(2, ["Energy"]), entry(3, ["Agri"])],
      },
    };

    it("is absent unless filterable", async () => {
      jsonpMock.mockResolvedValue(feed);
      wrap(<ArticleGrid />);
      await screen.findByText("Article 1");
      expect(screen.queryByRole("group", { name: "Filter by category" })).toBeNull();
    });

    it("is absent when filterable but no article has a category", async () => {
      jsonpMock.mockResolvedValue({ feed: { entry: [entry(1)] } });
      wrap(<ArticleGrid filterable />);
      await screen.findByText("Article 1");
      expect(screen.queryByRole("group", { name: "Filter by category" })).toBeNull();
    });

    it("offers All plus each distinct category in sorted order", async () => {
      jsonpMock.mockResolvedValue(feed);
      wrap(<ArticleGrid filterable />);
      const group = await screen.findByRole("group", { name: "Filter by category" });
      expect(
        within(group)
          .getAllByRole("button")
          .map((b) => b.textContent),
      ).toEqual(["All", "Agri", "Energy", "Trade"]);
      expect(within(group).getByRole("button", { name: "All" })).toHaveAttribute(
        "aria-pressed",
        "true",
      );
    });

    it("filters by any of an article's categories and returns to all", async () => {
      jsonpMock.mockResolvedValue(feed);
      wrap(<ArticleGrid filterable />);
      await screen.findByText("Article 1");
      fireEvent.click(screen.getByRole("button", { name: "Energy" }));
      expect(screen.getByRole("button", { name: "Energy" })).toHaveAttribute(
        "aria-pressed",
        "true",
      );
      expect(screen.getByRole("button", { name: "All" })).toHaveAttribute("aria-pressed", "false");
      expect(screen.getByText("Article 1")).toBeInTheDocument();
      expect(screen.getByText("Article 2")).toBeInTheDocument();
      expect(screen.queryByText("Article 3")).toBeNull();

      fireEvent.click(screen.getByRole("button", { name: "Agri" }));
      expect(screen.queryByText("Article 1")).toBeNull();
      expect(screen.getByText("Article 3")).toBeInTheDocument();

      fireEvent.click(screen.getByRole("button", { name: "All" }));
      expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(3);
    });

    it("applies the limit after filtering", async () => {
      jsonpMock.mockResolvedValue(feed);
      wrap(<ArticleGrid filterable limit={1} />);
      await screen.findByText("Article 1");
      fireEvent.click(screen.getByRole("button", { name: "Energy" }));
      expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(1);
    });
  });
});

describe("GithubRepos", () => {
  const repo = (n: number, extra: Record<string, unknown> = {}) => ({
    id: n,
    name: `repo-${n}`,
    description: `Description ${n}`,
    language: "TypeScript",
    stargazers_count: n * 10,
    updated_at: "2026-10-05T00:00:00Z",
    html_url: `https://github.com/${GITHUB_USER}/repo-${n}`,
    fork: false,
    ...extra,
  });
  const fetchMock = vi.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  const reply = (status: number, body: unknown = []) =>
    fetchMock.mockResolvedValue(new Response(JSON.stringify(body), { status }));

  it("shows a loading notice first", () => {
    fetchMock.mockReturnValue(new Promise(() => {}));
    wrap(<GithubRepos />);
    expect(screen.getByRole("status")).toHaveTextContent("Loading repositories…");
  });

  it("calls the GitHub API with the JSON accept header", async () => {
    reply(200, [repo(1)]);
    wrap(<GithubRepos />);
    await screen.findByText("repo-1");
    expect(fetchMock).toHaveBeenCalledWith(GITHUB_REPOS_URL, {
      headers: { Accept: "application/vnd.github+json" },
    });
  });

  it("lists each repository with link, description, language, stars and date", async () => {
    reply(200, [repo(1), repo(2, { language: null, description: null })]);
    wrap(<GithubRepos />);
    const links = await screen.findAllByRole("link");
    expect(links.map((a) => a.getAttribute("href"))).toEqual([
      `https://github.com/${GITHUB_USER}/repo-1`,
      `https://github.com/${GITHUB_USER}/repo-2`,
    ]);
    expect(links[0]).toHaveAttribute("target", "_blank");
    expect(links[0]).toHaveAttribute("rel", "noopener noreferrer");
    expect(within(links[0]!).getByText("Description 1")).toBeInTheDocument();
    expect(within(links[0]!).getByText("TypeScript")).toBeInTheDocument();
    expect(within(links[0]!).getByText("★ 10")).toBeInTheDocument();
    expect(within(links[0]!).getByText("Updated 5 Oct 2026")).toBeInTheDocument();
    expect(within(links[1]!).getByText("No description.")).toBeInTheDocument();
    expect(within(links[1]!).queryByText("TypeScript")).toBeNull();
    expect(within(links[1]!).getByText("★ 20")).toBeInTheDocument();
  });

  it("says there are no repositories for an empty list", async () => {
    reply(200, []);
    wrap(<GithubRepos />);
    expect(await screen.findByText("No public repositories yet.")).toBeInTheDocument();
  });

  it.each([403, 429])("explains the rate limit on HTTP %i", async (status) => {
    reply(status);
    wrap(<GithubRepos />);
    const notice = await screen.findByRole("status");
    await waitFor(() => expect(notice).toHaveTextContent("rate limit was reached"));
    expect(
      within(notice).getByRole("link", { name: "browse the profile directly" }),
    ).toHaveAttribute("href", `https://github.com/${GITHUB_USER}`);
  });

  it.each([404, 500, 503])("shows a generic failure on HTTP %i", async (status) => {
    reply(status);
    wrap(<GithubRepos />);
    const notice = await screen.findByText(/Couldn't reach GitHub right now/);
    expect(notice.textContent).not.toContain("rate limit");
    expect(within(notice).getByRole("link")).toHaveAttribute(
      "href",
      `https://github.com/${GITHUB_USER}`,
    );
  });

  it("shows the generic failure when the network request rejects", async () => {
    fetchMock.mockRejectedValue(new TypeError("offline"));
    wrap(<GithubRepos />);
    expect(await screen.findByText(/Couldn't reach GitHub right now/)).toBeInTheDocument();
  });

  it("does not retry a failed request", async () => {
    reply(500);
    wrap(<GithubRepos />);
    await screen.findByText(/Couldn't reach GitHub right now/);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
