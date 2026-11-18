import { describe, expect, it } from "vitest";
import { decodeEntities, isStale, mapFeed, parseTradeIdeas, previewText } from "./feeds";

describe("trade ideas staleness", () => {
  const now = new Date("2026-10-23T00:00:00Z");
  it("is fresh at 7 days", () => expect(isStale("2026-10-16", now)).toBe(false));
  it("is stale beyond 7 days", () => expect(isStale("2026-10-15", now)).toBe(true));
});

describe("parseTradeIdeas", () => {
  it("drops rows with invalid action", () => {
    const rows = parseTradeIdeas([
      { symbol: "A", exchange: "NSE", action: "BUY", entry: 1, target: null, stop: null, thesis: "", asOf: "2026-10-01" },
      { symbol: "B", exchange: "NSE", action: "MAYBE" },
    ]);
    expect(rows.map((r) => r.symbol)).toEqual(["A"]);
  });
});

describe("decodeEntities", () => {
  it("decodes named, decimal and hex entities to plain text", () => {
    expect(decodeEntities("Cabinet&rsquo;s &amp; &#8377;53,428 &#x20B9; crore")).toBe("Cabinet’s & ₹53,428 ₹ crore");
  });
  it("is used by mapFeed for titles and excerpts", () => {
    const a = mapFeed({
      feed: { entry: [{ title: { $t: "India&rsquo;s &#8377; bet" }, link: [{ rel: "alternate", href: "y" }], content: { $t: "<p>A&amp;B &#x20B9;1</p>" } }] },
    })[0]!;
    expect(a.title).toBe("India’s ₹ bet");
    expect(a.excerpt).toBe("A&B ₹1");
  });
});

describe("mapFeed", () => {
  it("uses the alternate link and first image", () => {
    const a = mapFeed({
      feed: { entry: [{ title: { $t: "T" }, link: [{ rel: "self", href: "x" }, { rel: "alternate", href: "y" }], content: { $t: '<img src="i.jpg"><p>Hi</p>' } }] },
    })[0]!;
    expect(a.link).toBe("y");
    expect(a.image).toBe("i.jpg");
  });
});

describe("previewText", () => {
  const post =
    '<div class="gs-head-order"><p class="standfirst">A grouped list of AI tutorial channels.</p>' +
    '<div class="topnav-index-link"><a href="x">&#8592; All Articles (Index)</a></div>' +
    '<h1>Learning AI for free</h1></div><p>Body text.</p>';
  it("skips the index link and uses the standfirst", () => {
    expect(previewText(post)).toBe("A grouped list of AI tutorial channels.");
  });
  it("drops the index link when there is no standfirst", () => {
    expect(previewText('<div class="topnav-index-link"><a>&#8592; All Articles (Index)</a></div><p>Body text.</p>')).toBe("Body text.");
  });
  it("falls back to plain text", () => {
    expect(previewText("<p>Hi</p>")).toBe("Hi");
  });
});
