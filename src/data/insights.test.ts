import { describe, expect, it } from "vitest";
import { INSIGHT_THEMES, articleSlug, findArticle } from "./insights";
import { MOST_READ } from "./mostRead";

describe("curated articles", () => {
  const articles = INSIGHT_THEMES.flatMap((theme) => theme.items);
  it("assigns every article a numeric Blogger post ID and unique slug", () => {
    for (const article of articles) expect(article.postId).toMatch(/^\d+$/);
    expect(new Set(articles.map((article) => articleSlug(article.url))).size).toBe(articles.length);
  });
  it("round-trips every curated article through its slug", () => {
    for (const article of articles) expect(findArticle(articleSlug(article.url))).toBe(article);
  });
  it("resolves all eight most-read URLs", () => {
    expect(MOST_READ).toHaveLength(8);
    for (const article of MOST_READ) expect(findArticle(articleSlug(article.url))?.url).toBe(article.url);
  });
});
import { LIBRARY, LIBRARY_THEMES, allFindableArticles, themeOverrides } from "./insights";
import allArticlesRaw from "./allArticles.json";
import retiredSlugs from "./retiredSlugs.json";
describe("full library", () => {
  it("lists every article in allArticles.json with numeric post IDs", () => {
    expect(LIBRARY).toHaveLength(allArticlesRaw.articles.length);
    expect(LIBRARY.length).toBeGreaterThan(400);
    for (const a of LIBRARY) expect(a.postId).toMatch(/^\d+$/);
  });
  it("theme overrides reference real themes and real library articles", () => {
    const slugs = new Set(LIBRARY_THEMES.map((t) => t.slug));
    const postIds = new Set(LIBRARY.map((a) => a.postId));
    for (const [postId, slug] of Object.entries(themeOverrides)) {
      expect(slugs.has(slug)).toBe(true);
      expect(postIds.has(postId)).toBe(true);
    }
    expect(Object.keys(themeOverrides).length).toBeGreaterThan(0);
  });
  it("has unique slugs across curated and library", () => {
    const slugs = LIBRARY.map((a) => articleSlug(a.url));
    expect(new Set(slugs).size).toBe(slugs.length);
    const all = allFindableArticles().map((a) => articleSlug(a.url));
    expect(new Set(all).size).toBe(all.length);
  });
  it("round-trips every library article through findArticle", () => {
    for (const a of LIBRARY) expect(articleSlug(findArticle(articleSlug(a.url))!.url)).toBe(articleSlug(a.url));
  });
});

describe("retired slugs", () => {
  it("redirect only to articles that exist, and are not themselves listed", () => {
    for (const [slug, target] of Object.entries(retiredSlugs as Record<string, string | null>)) {
      expect(findArticle(slug)).toBeUndefined();
      if (target) expect(findArticle(target)).toBeDefined();
    }
  });
});
