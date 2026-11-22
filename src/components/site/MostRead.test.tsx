import { screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { BLOG_URL } from "@/config";
import { MOST_READ } from "@/data/mostRead";
import { articleSlug } from "@/data/insights";
import { renderWithRouter } from "@/test/renderWithRouter";
import { MostRead } from "./MostRead";

const override = vi.hoisted(() => ({ items: undefined as undefined | unknown[] }));

vi.mock("@/data/mostRead", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/data/mostRead")>();
  return {
    ...actual,
    get MOST_READ() {
      return override.items ?? actual.MOST_READ;
    },
  };
});

beforeEach(() => {
  override.items = undefined;
});

const first = MOST_READ[0]!;
const asItem = (tag: string | undefined, i = 0) => ({
  ...MOST_READ[i]!,
  tags: tag === undefined ? [] : [tag],
});
const band = (card: HTMLElement) => card.querySelector("span[aria-hidden='true']")!;

describe("MostRead", () => {
  it("renders the section heading and intro", () => {
    renderWithRouter(<MostRead />);
    expect(
      screen.getByRole("heading", { level: 2, name: "Most read on Vertistrat Insights" }),
    ).toBeInTheDocument();
    expect(screen.getByText("From the blog")).toBeInTheDocument();
    expect(screen.getByText("Ranked by reader engagement, last 90 days.")).toBeInTheDocument();
    expect(screen.getByRole("region", { name: /Most read/ })).toHaveAttribute("id", "most-read");
  });

  it("lists every curated article, numbered from 01, linking to its insights page", () => {
    renderWithRouter(<MostRead />);
    const items = within(screen.getByRole("list")).getAllByRole("listitem");
    expect(items).toHaveLength(MOST_READ.length);
    MOST_READ.forEach((a, i) => {
      const link = within(items[i]!).getByRole("link");
      expect(link).toHaveAttribute("href", `/insights/${articleSlug(a.url)}`);
      expect(within(items[i]!).getByRole("heading", { level: 3 })).toHaveTextContent(a.title);
      expect(within(items[i]!).getByText(String(i + 1).padStart(2, "0"))).toBeInTheDocument();
      expect(within(items[i]!).getByText(a.tags[0]!)).toBeInTheDocument();
    });
  });

  it("makes only the first headline larger", () => {
    renderWithRouter(<MostRead />);
    const headings = screen.getAllByRole("heading", { level: 3 });
    expect(headings[0]).toHaveClass("text-xl");
    expect(headings[1]).not.toHaveClass("text-xl");
  });

  it("always links to all blog articles in a new tab", () => {
    renderWithRouter(<MostRead />);
    const link = screen.getByRole("link", { name: /All articles/ });
    expect(link).toHaveAttribute("href", BLOG_URL);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("shows the All insights link only when asked", () => {
    const { unmount } = renderWithRouter(<MostRead />);
    expect(screen.queryByRole("link", { name: "All insights →" })).toBeNull();
    unmount();
    renderWithRouter(<MostRead showInsightsLink />);
    expect(screen.getByRole("link", { name: "All insights →" })).toHaveAttribute(
      "href",
      "/insights",
    );
  });

  it("passes the class name to the section", () => {
    renderWithRouter(<MostRead className="my-class" />);
    expect(screen.getByRole("region", { name: /Most read/ })).toHaveClass("my-class");
  });

  it.each([
    ["Energy & Fuels", "bg-amber"],
    ["Ethanol & Biofuels", "bg-amber"],
    ["Trade & Tariffs", "bg-primary"],
    ["Food Processing", "bg-success"],
    ["Agri exports", "bg-success"],
    ["Corporate Finance & M&A", "bg-foreground"],
    ["Industrial Policy", "bg-accent-foreground"],
  ])("colours the %s band %s", (tag, cls) => {
    override.items = [asItem(tag)];
    renderWithRouter(<MostRead />);
    expect(band(screen.getAllByRole("link")[0]!)).toHaveClass(cls);
  });

  it("uses the default band and no tag label for an untagged article", () => {
    override.items = [asItem(undefined)];
    renderWithRouter(<MostRead />);
    const card = screen.getAllByRole("link")[0]!;
    expect(band(card)).toHaveClass("bg-accent-foreground");
    expect(card.querySelectorAll(".label-mono")).toHaveLength(1);
  });

  it("skips curated entries that have no matching article", () => {
    override.items = [
      first,
      {
        title: "Ghost",
        url: "https://blog.vertistratsolution.com/2026/01/does-not-exist.html",
        tags: ["x"],
      },
    ];
    renderWithRouter(<MostRead />);
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(1);
    expect(screen.queryByText("Ghost")).toBeNull();
  });
});
