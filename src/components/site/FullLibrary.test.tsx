import { fireEvent, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BLOG_URL } from "@/config";
import { LIBRARY, LIBRARY_THEMES, articleSlug, formatInsightDate } from "@/data/insights";
import { renderWithRouter } from "@/test/renderWithRouter";
import { FullLibrary } from "./FullLibrary";

const PAGE = 30;
const count = () => screen.getByText(/^\d+ articles$/);
const rows = () => within(screen.getByRole("list")).getAllByRole("listitem");
const chip = (name: RegExp | string) =>
  within(screen.getByRole("group", { name: "Filter by theme" })).getByRole("button", { name });

describe("FullLibrary", () => {
  it("has enough articles to exercise paging", () => {
    expect(LIBRARY.length).toBeGreaterThan(PAGE * 2);
  });

  it("starts with every article counted and the first page listed", () => {
    renderWithRouter(<FullLibrary />);
    expect(count()).toHaveTextContent(`${LIBRARY.length} articles`);
    expect(rows()).toHaveLength(PAGE);
    expect(
      screen.getByRole("button", { name: `Show more (${LIBRARY.length - PAGE} left)` }),
    ).toBeInTheDocument();
  });

  it("renders date, title link and theme name for each row", () => {
    renderWithRouter(<FullLibrary />);
    const first = LIBRARY[0]!;
    const row = rows()[0]!;
    const link = within(row).getByRole("link");
    expect(link).toHaveAttribute("href", `/insights/${articleSlug(first.url)}`);
    expect(within(row).getByText(first.title)).toBeInTheDocument();
    expect(within(row).getByText(formatInsightDate(first.published))).toHaveAttribute(
      "datetime",
      first.published,
    );
    const themeName = LIBRARY_THEMES.find((t) => t.slug === first.theme)?.name ?? "";
    expect(within(row).getByText(themeName)).toBeInTheDocument();
  });

  it("links to the blog in a new tab", () => {
    renderWithRouter(<FullLibrary />);
    const link = screen.getByRole("link", { name: /Read all on the blog/ });
    expect(link).toHaveAttribute("href", BLOG_URL);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("pages in steps of 30 and reduces the count on the button", () => {
    renderWithRouter(<FullLibrary />);
    fireEvent.click(screen.getByRole("button", { name: /Show more/ }));
    expect(rows()).toHaveLength(PAGE * 2);
    expect(
      screen.getByRole("button", { name: `Show more (${LIBRARY.length - PAGE * 2} left)` }),
    ).toBeInTheDocument();
  });

  it("removes the button once everything is shown", () => {
    renderWithRouter(<FullLibrary />);
    const title = LIBRARY[0]!.title;
    fireEvent.change(screen.getByLabelText("Search articles by title"), {
      target: { value: title },
    });
    const n = LIBRARY.filter((a) => a.title.toLowerCase().includes(title.toLowerCase())).length;
    expect(n).toBeGreaterThan(0);
    expect(n).toBeLessThanOrEqual(PAGE);
    expect(rows()).toHaveLength(n);
    expect(screen.queryByRole("button", { name: /Show more/ })).toBeNull();
  });

  it("offers an All chip and one per theme, each with its article count", () => {
    renderWithRouter(<FullLibrary />);
    const buttons = within(screen.getByRole("group", { name: "Filter by theme" })).getAllByRole(
      "button",
    );
    expect(buttons).toHaveLength(LIBRARY_THEMES.length + 1);
    expect(buttons[0]).toHaveTextContent(`All ${LIBRARY.length}`);
    expect(buttons[0]).toHaveAttribute("aria-pressed", "true");
    LIBRARY_THEMES.forEach((t, i) => {
      const n = LIBRARY.filter((a) => a.theme === t.slug).length;
      expect(buttons[i + 1]).toHaveTextContent(`${t.name} ${n}`);
      expect(buttons[i + 1]).toHaveAttribute("aria-pressed", "false");
    });
  });

  it("filters by theme and goes back to everything with All", () => {
    renderWithRouter(<FullLibrary />);
    const theme = LIBRARY_THEMES.find((t) => LIBRARY.filter((a) => a.theme === t.slug).length > 0)!;
    const n = LIBRARY.filter((a) => a.theme === theme.slug).length;
    fireEvent.click(chip(new RegExp(`^${theme.name.replace(/[()&.]/g, "\\$&")}`)));
    expect(count()).toHaveTextContent(`${n} articles`);
    expect(rows()).toHaveLength(Math.min(n, PAGE));
    fireEvent.click(chip(/^All/));
    expect(count()).toHaveTextContent(`${LIBRARY.length} articles`);
  });

  it("filters by title text, ignoring case and surrounding space", () => {
    renderWithRouter(<FullLibrary />);
    const word = "ethanol";
    const expected = LIBRARY.filter((a) => a.title.toLowerCase().includes(word)).length;
    expect(expected).toBeGreaterThan(0);
    fireEvent.change(screen.getByLabelText("Search articles by title"), {
      target: { value: `  ETHANOL ` },
    });
    expect(count()).toHaveTextContent(`${expected} articles`);
  });

  it("combines the theme and the text filter", () => {
    renderWithRouter(<FullLibrary />);
    fireEvent.change(screen.getByLabelText("Search articles by title"), {
      target: { value: "india" },
    });
    const all = LIBRARY.filter((a) => a.title.toLowerCase().includes("india"));
    expect(count()).toHaveTextContent(`${all.length} articles`);
    const theme = LIBRARY_THEMES[0]!;
    fireEvent.click(chip(new RegExp(`^${theme.name.replace(/[()&.]/g, "\\$&")}`)));
    expect(count()).toHaveTextContent(
      `${all.filter((a) => a.theme === theme.slug).length} articles`,
    );
  });

  it("says so and hides the list when nothing matches", () => {
    renderWithRouter(<FullLibrary />);
    fireEvent.change(screen.getByLabelText("Search articles by title"), {
      target: { value: "zzzz-nothing-matches" },
    });
    expect(count()).toHaveTextContent("0 articles");
    expect(screen.getByText("No articles match.")).toBeInTheDocument();
    expect(screen.queryByRole("list")).toBeNull();
    expect(screen.queryByRole("button", { name: /Show more/ })).toBeNull();
  });

  it("returns to the first page when the search or the theme changes", () => {
    renderWithRouter(<FullLibrary />);
    fireEvent.click(screen.getByRole("button", { name: /Show more/ }));
    expect(rows()).toHaveLength(PAGE * 2);

    fireEvent.change(screen.getByLabelText("Search articles by title"), { target: { value: "a" } });
    expect(rows().length).toBeLessThanOrEqual(PAGE);

    fireEvent.change(screen.getByLabelText("Search articles by title"), { target: { value: "" } });
    fireEvent.click(screen.getByRole("button", { name: /Show more/ }));
    expect(rows()).toHaveLength(PAGE * 2);
    fireEvent.click(chip(/^All/));
    expect(rows()).toHaveLength(PAGE);
  });
});
