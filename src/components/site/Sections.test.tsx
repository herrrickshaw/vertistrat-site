import { fireEvent, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { INSIGHT_THEMES, articleSlug } from "@/data/insights";
import { GUIDE_TOPICS, SECTOR_INFO, guideArticles, matchArticles } from "@/lib/guides";
import { renderWithRouter } from "@/test/renderWithRouter";
import { GuideTiles, HelpGrid, InsightToAdvisory, SectorTiles, TalkStrip } from "./Sections";
import { SECTORS } from "./ui";

describe("HelpGrid", () => {
  it("lists twelve services, each linking to the right page", () => {
    renderWithRouter(<HelpGrid />);
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(12);
    const byLabel = Object.fromEntries(links.map((a) => [a.textContent, a.getAttribute("href")]));
    expect(byLabel["Market entry"]).toBe("/manufacturing");
    expect(byLabel["Supply-chain localisation"]).toBe("/manufacturing");
    expect(byLabel["Delivery centre / GCC set-up"]).toBe("/it-services");
    expect(byLabel["Vendor selection"]).toBe("/it-services");
  });

  it("sends the investment services to the home page investment section", () => {
    renderWithRouter(<HelpGrid />);
    for (const name of [
      "Central & state incentives",
      "PLI & scheme claims",
      "Investor briefing",
      "Aftercare & compliance",
    ]) {
      expect(screen.getByRole("link", { name })).toHaveAttribute("href", "/#investment");
    }
  });
});

describe("GuideTiles", () => {
  it("renders a tile per guide topic that has articles, linking to its first article", () => {
    renderWithRouter(<GuideTiles />);
    const links = screen.getAllByRole("link");
    const expected = GUIDE_TOPICS.filter((g) => guideArticles(g.key).length > 0);
    expect(expected.length).toBeGreaterThan(0);
    expect(links).toHaveLength(expected.length);
    expected.forEach((g, i) => {
      const items = guideArticles(g.key);
      expect(links[i]).toHaveAttribute("href", `/insights/${articleSlug(items[0]!.url)}`);
      expect(within(links[i]!).getByText(g.label)).toBeInTheDocument();
      expect(within(links[i]!).getByText(`Start: ${items[0]!.title}`)).toBeInTheDocument();
      expect(
        within(links[i]!).getByText(
          `${items.length} ${items.length === 1 ? "article" : "articles"}`,
        ),
      ).toBeInTheDocument();
    });
  });
});

describe("InsightToAdvisory", () => {
  it("shows one card per insight theme, each pointing to the contact section", () => {
    renderWithRouter(<InsightToAdvisory />);
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(INSIGHT_THEMES.length);
    INSIGHT_THEMES.forEach((t, i) => {
      expect(within(items[i]!).getByText(t.theme)).toBeInTheDocument();
      expect(within(items[i]!).getByRole("link", { name: "Discuss this →" })).toHaveAttribute(
        "href",
        "/#contact",
      );
    });
  });

  it("names the advisory service for each known theme", () => {
    renderWithRouter(<InsightToAdvisory />);
    expect(screen.getByText("Incentive mapping & approvals")).toBeInTheDocument();
    expect(screen.getByText("Biofuel & energy project advisory")).toBeInTheDocument();
    expect(screen.getByText("Market entry & localisation")).toBeInTheDocument();
    expect(screen.getByText("Food processing plant set-up")).toBeInTheDocument();
    expect(screen.getByText("Investor briefing & green finance")).toBeInTheDocument();
  });
});

describe("SectorTiles", () => {
  const tile = (name: string) => screen.getByRole("button", { name });

  it("renders a button per sector by default, or only `count` of them", () => {
    const { unmount } = renderWithRouter(<SectorTiles />);
    expect(screen.getAllByRole("button")).toHaveLength(SECTORS.length);
    unmount();
    renderWithRouter(<SectorTiles count={3} />);
    expect(screen.getAllByRole("button").map((b) => b.textContent)).toEqual(SECTORS.slice(0, 3));
  });

  it("keeps the details dialog closed until a sector is chosen", () => {
    renderWithRouter(<SectorTiles />);
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(tile(SECTORS[0]!)).toHaveAttribute("aria-haspopup", "dialog");
  });

  it("opens a dialog with the sector's name and blurb", () => {
    renderWithRouter(<SectorTiles />);
    fireEvent.click(tile(SECTORS[3]!));
    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByText(SECTORS[3]!)).toBeInTheDocument();
    expect(within(dialog).getByText(SECTOR_INFO[3]!.blurb)).toBeInTheDocument();
  });

  it("lists related insights for sectors with a pattern, linking to each article", () => {
    renderWithRouter(<SectorTiles />);
    fireEvent.click(tile(SECTORS[6]!));
    const dialog = screen.getByRole("dialog");
    const related = matchArticles(SECTOR_INFO[6]!.pattern);
    expect(related.length).toBeGreaterThan(0);
    expect(within(dialog).getByText("Related insights")).toBeInTheDocument();
    const links = within(dialog)
      .getAllByRole("link")
      .filter((a) => a.getAttribute("href")!.startsWith("/insights/"));
    expect(links.map((a) => a.getAttribute("href"))).toEqual(
      related.map((a) => `/insights/${articleSlug(a.url)}`),
    );
  });

  it("omits the related insights block for sectors without a pattern", () => {
    renderWithRouter(<SectorTiles />);
    fireEvent.click(tile(SECTORS[3]!));
    expect(SECTOR_INFO[3]!.pattern).toBeNull();
    expect(within(screen.getByRole("dialog")).queryByText("Related insights")).toBeNull();
  });

  it("offers the biofuels practice link for the renewable energy sector only", () => {
    renderWithRouter(<SectorTiles />);
    fireEvent.click(tile(SECTORS[6]!));
    expect(
      within(screen.getByRole("dialog")).getByRole("link", { name: "See the practice →" }),
    ).toHaveAttribute("href", "/biofuels-energy");
    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });
    fireEvent.click(tile(SECTORS[5]!));
    expect(within(screen.getByRole("dialog")).queryByRole("link", { name: /practice/ })).toBeNull();
  });

  it("links Talk to us to the contact section and closes the dialog when followed", () => {
    renderWithRouter(<SectorTiles />);
    fireEvent.click(tile(SECTORS[0]!));
    const talk = within(screen.getByRole("dialog")).getByRole("link", { name: "Talk to us" });
    expect(talk).toHaveAttribute("href", "/#contact");
    fireEvent.click(talk);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("closes on Escape", () => {
    renderWithRouter(<SectorTiles />);
    fireEvent.click(tile(SECTORS[0]!));
    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("switches the dialog to another sector when a different tile is chosen", () => {
    renderWithRouter(<SectorTiles />);
    fireEvent.click(tile(SECTORS[1]!));
    expect(within(screen.getByRole("dialog")).getByText(SECTOR_INFO[1]!.blurb)).toBeInTheDocument();
    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });
    fireEvent.click(tile(SECTORS[2]!));
    expect(within(screen.getByRole("dialog")).getByText(SECTOR_INFO[2]!.blurb)).toBeInTheDocument();
  });
});

describe("TalkStrip", () => {
  it("is a labelled region with a link to the contact section", () => {
    renderWithRouter(<TalkStrip />);
    const region = screen.getByRole("region", { name: "Talk to our team" });
    expect(within(region).getByText("Talk to our team about your project.")).toBeInTheDocument();
    expect(within(region).getByRole("link", { name: "Talk to our team" })).toHaveAttribute(
      "href",
      "/#contact",
    );
  });
});
