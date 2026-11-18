import { BLOG_HOST } from "@/config";

/** Point any blog post URL at the public blog domain. */
export function toBlogUrl(url: string): string {
  try { const u = new URL(url); u.protocol = "https:"; u.host = BLOG_HOST; return u.toString(); } catch { return url; }
}

export type Article = {
  id: string;
  title: string;
  link: string;
  published: string;
  image: string | null;
  excerpt: string;
  categories: string[];
};

/** Decode HTML entities (named, decimal and hex) to plain text via inert DOM parsing. */
export function decodeEntities(text: string): string {
  return new DOMParser().parseFromString(text, "text/html").documentElement.textContent ?? text;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export function stripHtml(html: string): string {
  const tags = html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ");
  return decodeEntities(tags).replace(/\s+/g, " ").trim();
}

export function excerpt(text: string, max = 160): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const sp = cut.lastIndexOf(" ");
  return `${(sp > 80 ? cut.slice(0, sp) : cut).trim()}…`;
}

/**
 * Text for a post preview. Blog posts open with a "← All Articles (Index)" link and carry the
 * standfirst before the headline in the markup, so a plain strip of the first characters shows
 * navigation text. Drop the nav blocks and prefer the standfirst paragraph when the post has one.
 */
export function previewText(html: string): string {
  const body = html
    .replace(/<nav[\s\S]*?<\/nav>/gi, " ")
    .replace(/<div[^>]*class=["'][^"']*topnav-index-link[^"']*["'][^>]*>[\s\S]*?<\/div>/gi, " ");
  const standfirst = body.match(/<p[^>]*class=["'][^"']*standfirst[^"']*["'][^>]*>([\s\S]*?)<\/p>/i)?.[1];
  const text = stripHtml(standfirst ?? body);
  return excerpt(text || stripHtml(body));
}

export function mapFeed(json: any): Article[] {
  const entries: any[] = json?.feed?.entry ?? [];
  return entries.map((e, i) => {
    const html: string = e?.content?.$t ?? e?.summary?.$t ?? "";
    const thumb: string | undefined = e?.media$thumbnail?.url;
    const imgMatch = html.match(/<img[^>]+src=["']([^"']+)["']/i);
    const link = (e?.link ?? []).find((l: any) => l.rel === "alternate")?.href ?? "";
    return {
      id: e?.id?.$t ?? String(i),
      title: e?.title?.$t ? decodeEntities(e.title.$t).replace(/\s+/g, " ").trim() : "Untitled",
      link: link ? toBlogUrl(link) : "",
      published: e?.published?.$t ?? "",
      image: (thumb ? thumb.replace(/\/s72(-c)?\//, "/w600-h340-c/") : null) ?? imgMatch?.[1] ?? null,
      excerpt: previewText(html),
      categories: (e?.category ?? []).map((c: any) => c.term).filter(Boolean),
    };
  });
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export type Action = "BUY" | "WATCH" | "SELL" | "HOLD";
export type TradeIdea = {
  symbol: string;
  exchange: string;
  action: Action;
  entry: number | null;
  target: number | null;
  stop: number | null;
  thesis: string;
  asOf: string;
};

const ACTIONS: Action[] = ["BUY", "WATCH", "SELL", "HOLD"];

export function parseTradeIdeas(json: unknown): TradeIdea[] {
  if (!Array.isArray(json)) throw new Error("Expected a JSON array");
  const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : null);
  return json
    .filter((r: any) => r && typeof r.symbol === "string" && ACTIONS.includes(r.action))
    .map((r: any) => ({
      symbol: r.symbol,
      exchange: String(r.exchange ?? ""),
      action: r.action,
      entry: num(r.entry),
      target: num(r.target),
      stop: num(r.stop),
      thesis: String(r.thesis ?? ""),
      asOf: String(r.asOf ?? ""),
    }));
}

export function isStale(asOf: string, now: Date = new Date(), days = 7): boolean {
  const d = new Date(`${asOf}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return true;
  return now.getTime() - d.getTime() > days * 86_400_000;
}
