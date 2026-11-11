import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen } from "lucide-react";
import { themeIcon } from "@/components/site/themeIcons";
import { IconChip, PageHero, Placeholder, Section, StatTile, btn, pageHead, type Tone } from "@/components/site/ui";
import { ArticleGrid, GithubRepos } from "@/components/site/Feeds";
import { MostRead } from "@/components/site/MostRead";
import { GuideTiles, InsightToAdvisory } from "@/components/site/Sections";
import { FullLibrary } from "@/components/site/FullLibrary";
import { INSIGHT_THEMES, LIBRARY, articleSlug, formatInsightDate, isLiveUrl, type InsightItem } from "@/data/insights";
import { MOST_READ, MOST_READ_INDEX_URL } from "@/data/mostRead";
import { BLOG_URL } from "@/config";

export const Route = createFileRoute("/insights/")({
  head: () => pageHead("Vertistrat Insights", "Vertistrat Insights: research on Indian industry, energy, trade and investment from VertiStrat Solutions.", "/insights"),
  component: Insights,
});

const ext = { target: "_blank", rel: "noopener noreferrer" } as const;
const TONES: [Tone, Tone, Tone, Tone, Tone] = ["primary", "amber", "card", "card", "ink"];
const keyCount = INSIGHT_THEMES.reduce((n, t) => n + t.items.length, 0);

const BANDS = ["bg-primary", "bg-amber", "bg-accent-foreground", "bg-success", "bg-foreground"];

function InsightCard({ item, slug, i }: { item: InsightItem; slug: string; i: number }) {
  const Icon = themeIcon(slug);
  const live = isLiveUrl(item.url);
  const body = (
    <div className={`tile flex h-full flex-col overflow-hidden bg-card ${live ? "tile-hover" : ""}`}>
      <span aria-hidden="true" className={`flex h-9 items-center px-5 text-background ${BANDS[i] ?? "bg-primary"}`}><Icon className="h-4 w-4" strokeWidth={2} /></span>
      <div className="flex flex-1 flex-col p-5">
      <time dateTime={item.published} className="label-mono text-muted-foreground">{formatInsightDate(item.published)}</time>
      <h3 className="mt-2 font-semibold leading-snug">{item.title}</h3>
      <div className="reveal"><div><p className="pt-2 text-sm text-muted-foreground">{item.excerpt}</p></div></div>
      <p className="mt-auto pt-4 text-sm font-medium text-primary">{live ? <>Read →</> : <Placeholder>Link coming soon</Placeholder>}</p>
      </div>
    </div>
  );
  return live ? <Link to="/insights/$slug" params={{ slug: articleSlug(item.url) }} className="group block h-full rounded-xl">{body}</Link> : <div className="group h-full">{body}</div>;
}

function Insights() {
  return (
    <>
      <PageHero eyebrow="Insights" title="Vertistrat Insights" line="Research on Indian industry, energy, trade and investment."
        aside={<div className="grid grid-cols-2 gap-4"><StatTile value={String(INSIGHT_THEMES.length)} label="Themes" tone="primary" /><StatTile value={String(keyCount)} label="Key articles" tone="ink" /><StatTile value={String(MOST_READ.length)} label="Most-read" tone="amber" /><StatTile value={String(LIBRARY.length)} label="Total articles" tone="card" /></div>}>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href={MOST_READ_INDEX_URL} {...ext} className={btn.primary}>Browse all articles</a>
          <a href={BLOG_URL} {...ext} className={btn.outline}>Visit Vertistrat Insights blog →<span className="sr-only"> (opens in new tab)</span></a>
        </div>
      </PageHero>

      <nav aria-label="Themes" className="container-site py-10">
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {INSIGHT_THEMES.map((t, i) => (
            <li key={t.slug}>
              <a href={`#${t.slug}`} className={`group tile tile-hover flex h-full min-h-36 flex-col p-5 ${TONES[i] === "ink" ? "border-ink-border bg-ink text-ink-foreground" : TONES[i] === "primary" ? "bg-primary-soft" : TONES[i] === "amber" ? "bg-amber-soft" : "bg-card"}`}>
                <IconChip icon={themeIcon(t.slug)} tone={TONES[i] ?? "card"} />
                <span className="mt-auto pt-5 font-display font-semibold leading-tight">{t.theme}</span>
                <span className={`label-mono mt-1 ${TONES[i] === "ink" ? "text-ink-muted" : "text-muted-foreground"}`}>{t.items.length} articles ↓</span>
              </a>
            </li>
          ))}
          <li className="sm:col-span-2 lg:col-span-5">
            <a href="#library" className="tile tile-hover flex items-center justify-between bg-card p-5 font-display font-semibold">
              <span className="flex items-center gap-3"><BookOpen className="h-5 w-5 text-primary" aria-hidden="true" />Full library</span>
              <span className="label-mono text-muted-foreground">{LIBRARY.length} articles ↓</span>
            </a>
          </li>
        </ul>
      </nav>

      <MostRead className="border-y bg-card/40" />

      <Section id="guide" eyebrow="Doing business in India" title="Guide by topic" className="scroll-mt-16">
        <GuideTiles />
      </Section>

      <Section id="advisory" eyebrow="From insight to advisory" title="Read it, then act on it" className="border-y bg-card/40">
        <InsightToAdvisory />
      </Section>

      <div className="border-b">
        <div className="container-site pt-14 md:pt-20">
          <p className="label-mono flex items-center gap-2 text-muted-foreground"><BookOpen className="h-4 w-4 text-amber" aria-hidden="true" />Library</p>
          <h2 className="mt-3 text-3xl font-semibold md:text-4xl">Key insights by theme</h2>
        </div>
        {INSIGHT_THEMES.map((t, i) => (
          <Section key={t.slug} id={t.slug} eyebrow={`Theme ${String(i + 1).padStart(2, "0")}`} title={t.theme} className="scroll-mt-24">
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {t.items.map((item) => <li key={item.title}><InsightCard item={item} slug={t.slug} i={i} /></li>)}
            </ul>
          </Section>
        ))}
      </div>
      <Section id="library" eyebrow="Archive" title={`Full library · ${LIBRARY.length} articles`} className="scroll-mt-24"><FullLibrary /></Section>
      <Section id="articles" eyebrow="Latest" title="New on the blog"><ArticleGrid filterable /></Section>
      <Section id="github" eyebrow="Open source" title="From our GitHub" className="border-t"><GithubRepos /></Section>
    </>
  );
}
