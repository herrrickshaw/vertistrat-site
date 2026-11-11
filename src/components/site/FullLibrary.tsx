import { Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { BLOG_URL } from "@/config";
import { LIBRARY, LIBRARY_THEMES, articleSlug, formatInsightDate } from "@/data/insights";
import { btn } from "./ui";

const PAGE = 30;
const focus = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";
const nameOf = (slug?: string) => LIBRARY_THEMES.find((t) => t.slug === slug)?.name ?? "";

export function FullLibrary() {
  const [query, setQuery] = useState("");
  const [theme, setTheme] = useState<string | null>(null);
  const [shown, setShown] = useState(PAGE);
  const counts = useMemo(() => Object.fromEntries(LIBRARY_THEMES.map((t) => [t.slug, LIBRARY.filter((a) => a.theme === t.slug).length])), []);
  const q = query.trim().toLowerCase();
  const items = LIBRARY.filter((a) => (!theme || a.theme === theme) && (!q || a.title.toLowerCase().includes(q)));
  const chips = [{ slug: null as string | null, name: "All", n: LIBRARY.length }, ...LIBRARY_THEMES.map((t) => ({ ...t, n: counts[t.slug] ?? 0 }))];

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <label className="block w-full md:max-w-sm">
          <span className="sr-only">Search articles by title</span>
          <input type="search" value={query} onChange={(e) => { setQuery(e.target.value); setShown(PAGE); }} placeholder="Search titles…"
            className={`w-full rounded-xl border bg-card px-4 py-2.5 text-sm ${focus}`} />
        </label>
        <a href={BLOG_URL} target="_blank" rel="noopener noreferrer" className={btn.primary}>Read all on the blog<span className="sr-only"> (opens in new tab)</span> ↗</a>
      </div>
      <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Filter by theme">
        {chips.map((c) => (
          <button key={c.slug ?? "all"} type="button" aria-pressed={theme === c.slug} onClick={() => { setTheme(c.slug); setShown(PAGE); }}
            className={`rounded-full border px-3 py-1 text-xs ${focus} ${theme === c.slug ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:bg-muted"}`}>
            {c.name} <span className="opacity-70">{c.n}</span>
          </button>
        ))}
      </div>
      <p className="label-mono mt-5 text-muted-foreground" aria-live="polite">{items.length} articles</p>
      {items.length === 0 ? <p className="mt-4 text-sm text-muted-foreground">No articles match.</p> : (
        <ul className="mt-3 divide-y rounded-xl border bg-card">
          {items.slice(0, shown).map((a) => (
            <li key={a.postId}>
              <Link to="/insights/$slug" params={{ slug: articleSlug(a.url) }} className={`flex flex-col gap-1 px-4 py-3 hover:bg-muted sm:flex-row sm:items-center sm:gap-4 ${focus}`}>
                <time dateTime={a.published} className="label-mono shrink-0 text-muted-foreground sm:w-28">{formatInsightDate(a.published)}</time>
                <span className="min-w-0 flex-1 break-words font-medium">{a.title}</span>
                <span className="label-mono w-fit shrink-0 rounded-full bg-primary-soft px-2 py-0.5 text-foreground">{nameOf(a.theme)}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
      {shown < items.length && (
        <button type="button" onClick={() => setShown(shown + PAGE)} className={`${btn.outline} mt-6`}>Show more ({items.length - shown} left)</button>
      )}
    </div>
  );
}
