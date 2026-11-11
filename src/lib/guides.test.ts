import { describe, expect, it } from "vitest";
import { INSIGHT_THEMES, LIBRARY } from "@/data/insights";
import { GUIDE_TOPICS, guideArticles, SECTOR_INFO, energyPracticeArticles } from "./guides";

const known = new Set([...INSIGHT_THEMES.flatMap((t) => t.items), ...LIBRARY].map((i) => i.url));

describe("guide topics", () => {
  it("includes at least three energy practice articles from the existing library", () => {
    const articles = energyPracticeArticles();
    expect(articles.length).toBeGreaterThanOrEqual(3);
    for (const article of articles) expect(known.has(article.url)).toBe(true);
  });
  it("has the six requested topics", () => {
    expect(GUIDE_TOPICS.map((g) => g.label)).toEqual(["Company setup", "Incentives & schemes", "Approvals", "Land & site", "Trade & customs", "Energy & utilities"]);
  });
  it("only links to URLs already in insights.ts, and every topic has at least one", () => {
    for (const g of GUIDE_TOPICS) {
      const a = guideArticles(g.key);
      expect(a.length).toBeGreaterThan(0);
      for (const x of a) expect(known.has(x.url)).toBe(true);
    }
  });
  it("each topic opens on a different article", () => {
    const leads: string[] = [];
    for (const g of GUIDE_TOPICS) {
      const a = guideArticles(g.key);
      expect(a.length).toBeGreaterThan(0);
      const first = a[0];
      if (!first) throw new Error(`${g.key} has no articles`);
      leads.push(first.url);
    }
    expect(new Set(leads).size).toBe(leads.length);
  });
  it("sector blurbs stay within 12 words", () => {
    for (const s of SECTOR_INFO) expect(s.blurb.split(/\s+/).length).toBeLessThanOrEqual(12);
  });
});
