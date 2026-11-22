import { describe, expect, it } from "vitest";
import { BLOG_HOST } from "@/config";
import {
  excerpt,
  formatDate,
  isStale,
  mapFeed,
  parseTradeIdeas,
  stripHtml,
  toBlogUrl,
} from "./feeds";

describe("toBlogUrl", () => {
  it("moves a blogspot post to the public blog host over https, keeping path and query", () => {
    expect(toBlogUrl("http://old.blogspot.com/2026/08/post.html?m=1#top")).toBe(
      `https://${BLOG_HOST}/2026/08/post.html?m=1#top`,
    );
  });

  it("returns input that is not an absolute URL unchanged", () => {
    expect(toBlogUrl("/relative/path")).toBe("/relative/path");
    expect(toBlogUrl("")).toBe("");
  });
});

describe("stripHtml", () => {
  it("removes tags, script and style bodies and collapses whitespace", () => {
    const html =
      "<style>p{color:red}</style><script>alert(1)</script><p>Hello</p>\n\n<p>  big   world </p>";
    expect(stripHtml(html)).toBe("Hello big world");
  });

  it("separates adjacent tags with a space and decodes entities", () => {
    expect(stripHtml("<b>a</b><i>b</i> &amp; c")).toBe("a b & c");
  });

  it("returns an empty string for markup with no text", () => {
    expect(stripHtml("<img src='x'><br>")).toBe("");
  });
});

describe("excerpt", () => {
  it("returns text at or under the limit untouched", () => {
    expect(excerpt("short")).toBe("short");
    expect(excerpt("x".repeat(160))).toBe("x".repeat(160));
  });

  it("cuts at the last space when it falls after character 80", () => {
    const text = `${"a".repeat(100)} ${"b".repeat(100)}`;
    expect(excerpt(text)).toBe(`${"a".repeat(100)}…`);
  });

  it("cuts hard when the last space is at index 80 or earlier", () => {
    const atEighty = `${"a".repeat(80)} ${"b".repeat(200)}`;
    expect(excerpt(atEighty)).toBe(`${"a".repeat(80)} ${"b".repeat(79)}…`);
    const atEightyOne = `${"a".repeat(81)} ${"b".repeat(200)}`;
    expect(excerpt(atEightyOne)).toBe(`${"a".repeat(81)}…`);
  });

  it("honours a custom maximum", () => {
    expect(excerpt("abcdefghij", 5)).toBe("abcde…");
    expect(excerpt("abcde", 5)).toBe("abcde");
  });
});

describe("mapFeed", () => {
  it("returns an empty list for missing or malformed feeds", () => {
    expect(mapFeed(undefined)).toEqual([]);
    expect(mapFeed({})).toEqual([]);
    expect(mapFeed({ feed: {} })).toEqual([]);
    expect(mapFeed({ feed: { entry: [] } })).toEqual([]);
  });

  it("fills defaults for an empty entry, using the index as id", () => {
    const [a, b] = mapFeed({ feed: { entry: [{}, {}] } });
    expect(a).toEqual({
      id: "0",
      title: "Untitled",
      link: "",
      published: "",
      image: null,
      excerpt: "",
      categories: [],
    });
    expect(b!.id).toBe("1");
  });

  it("maps id, title, published, link and categories", () => {
    const [a] = mapFeed({
      feed: {
        entry: [
          {
            id: { $t: "tag:blogger.com,1999:blog-1.post-2" },
            title: { $t: "  Spaced \n  title " },
            published: { $t: "2026-08-01T10:00:00Z" },
            link: [{ rel: "alternate", href: "http://x.blogspot.com/2026/08/p.html" }],
            category: [{ term: "Energy" }, { term: "" }, {}, { term: "Trade" }],
            content: { $t: "<p>Body</p>" },
          },
        ],
      },
    });
    expect(a).toMatchObject({
      id: "tag:blogger.com,1999:blog-1.post-2",
      title: "Spaced title",
      published: "2026-08-01T10:00:00Z",
      link: `https://${BLOG_HOST}/2026/08/p.html`,
      categories: ["Energy", "Trade"],
      excerpt: "Body",
    });
  });

  it("falls back to the summary when there is no content", () => {
    const [a] = mapFeed({ feed: { entry: [{ summary: { $t: "<p>Sum</p>" } }] } });
    expect(a!.excerpt).toBe("Sum");
  });

  it("prefers content over summary", () => {
    const [a] = mapFeed({
      feed: { entry: [{ content: { $t: "<p>C</p>" }, summary: { $t: "<p>S</p>" } }] },
    });
    expect(a!.excerpt).toBe("C");
  });

  it("has an empty link when the entry has no alternate link", () => {
    const [a] = mapFeed({ feed: { entry: [{ link: [{ rel: "self", href: "x" }] }] } });
    expect(a!.link).toBe("");
  });

  it("upgrades a 72px thumbnail (plain or cropped) to a 600x340 crop and prefers it to inline images", () => {
    const entry = (url: string) => ({
      media$thumbnail: { url },
      content: { $t: '<img src="inline.jpg">' },
    });
    const [plain, cropped, other] = mapFeed({
      feed: {
        entry: [
          entry("https://img/s72/a.png"),
          entry("https://img/s72-c/a.png"),
          entry("https://img/s100/a.png"),
        ],
      },
    });
    expect(plain!.image).toBe("https://img/w600-h340-c/a.png");
    expect(cropped!.image).toBe("https://img/w600-h340-c/a.png");
    expect(other!.image).toBe("https://img/s100/a.png");
  });

  it("falls back to the first inline image, with either quote style, then to null", () => {
    const [single, double, none] = mapFeed({
      feed: {
        entry: [
          { content: { $t: "<img alt='' src='one.jpg'>" } },
          { content: { $t: '<img class="x" src="two.jpg"><img src="three.jpg">' } },
          { content: { $t: "<p>none</p>" } },
        ],
      },
    });
    expect(single!.image).toBe("one.jpg");
    expect(double!.image).toBe("two.jpg");
    expect(none!.image).toBeNull();
  });
});

describe("formatDate", () => {
  it("formats an ISO date in en-GB style", () => {
    expect(formatDate("2026-03-05T12:00:00Z")).toBe("5 Mar 2026");
    expect(formatDate("2026-11-20")).toBe("20 Nov 2026");
  });

  it("returns an empty string for an invalid or empty date", () => {
    expect(formatDate("")).toBe("");
    expect(formatDate("not a date")).toBe("");
  });
});

describe("parseTradeIdeas (more)", () => {
  it("rejects anything that is not an array", () => {
    expect(() => parseTradeIdeas({})).toThrow("Expected a JSON array");
    expect(() => parseTradeIdeas(null)).toThrow("Expected a JSON array");
    expect(() => parseTradeIdeas("[]")).toThrow("Expected a JSON array");
  });

  it("keeps all four valid actions", () => {
    const rows = parseTradeIdeas(
      ["BUY", "WATCH", "SELL", "HOLD"].map((action) => ({ symbol: "S", action })),
    );
    expect(rows.map((r) => r.action)).toEqual(["BUY", "WATCH", "SELL", "HOLD"]);
  });

  it("drops null rows, non-string symbols and lower-case actions", () => {
    const rows = parseTradeIdeas([
      null,
      0,
      { symbol: 5, action: "BUY" },
      { symbol: "A", action: "buy" },
      { symbol: "OK", action: "SELL" },
    ]);
    expect(rows.map((r) => r.symbol)).toEqual(["OK"]);
  });

  it("applies defaults for missing text fields and null for missing prices", () => {
    expect(parseTradeIdeas([{ symbol: "A", action: "HOLD" }])).toEqual([
      {
        symbol: "A",
        exchange: "",
        action: "HOLD",
        entry: null,
        target: null,
        stop: null,
        thesis: "",
        asOf: "",
      },
    ]);
  });

  it("keeps finite numbers (including 0 and negatives) and nulls everything else", () => {
    const [row] = parseTradeIdeas([
      { symbol: "A", action: "BUY", entry: 0, target: -1.5, stop: "12" },
    ]);
    expect(row).toMatchObject({ entry: 0, target: -1.5, stop: null });
    const [bad] = parseTradeIdeas([
      { symbol: "A", action: "BUY", entry: NaN, target: Infinity, stop: null },
    ]);
    expect(bad).toMatchObject({ entry: null, target: null, stop: null });
  });

  it("stringifies exchange, thesis and asOf", () => {
    const [row] = parseTradeIdeas([
      { symbol: "A", action: "BUY", exchange: 7, thesis: "why", asOf: "2026-11-01" },
    ]);
    expect(row).toMatchObject({ exchange: "7", thesis: "why", asOf: "2026-11-01" });
  });
});

describe("isStale (more)", () => {
  const now = new Date("2026-10-23T00:00:00Z");

  it("treats an unparseable date as stale", () => {
    expect(isStale("", now)).toBe(true);
    expect(isStale("garbage", now)).toBe(true);
  });

  it("is stale only strictly beyond the window, down to the millisecond", () => {
    expect(isStale("2026-10-16", new Date("2026-10-23T00:00:00.000Z"))).toBe(false);
    expect(isStale("2026-10-16", new Date("2026-10-23T00:00:00.001Z"))).toBe(true);
  });

  it("honours a custom day window", () => {
    expect(isStale("2026-10-22", now, 1)).toBe(false);
    expect(isStale("2026-10-21", now, 1)).toBe(true);
    expect(isStale("2026-10-01", now, 30)).toBe(false);
  });

  it("is not stale for a date in the future", () => {
    expect(isStale("2026-12-01", now)).toBe(false);
  });

  it("uses the current time when no reference is given", () => {
    const today = new Date().toISOString().slice(0, 10);
    expect(isStale(today)).toBe(false);
    expect(isStale("2000-01-01")).toBe(true);
  });
});
