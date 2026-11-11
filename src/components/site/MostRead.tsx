import { Link } from "@tanstack/react-router";
import { Section } from "@/components/site/ui";
import { MOST_READ } from "@/data/mostRead";
import { BLOG_URL } from "@/config";
import { articleSlug, findArticle } from "@/data/insights";
import { tagIcon } from "./themeIcons";

// Coloured top band per blog theme (by first tag).
function band(tag = "") {
  if (/energy|ethanol|fuel/i.test(tag)) return "bg-amber";
  if (/trade|tariff/i.test(tag)) return "bg-primary";
  if (/food|agri/i.test(tag)) return "bg-success";
  if (/finance|m&a/i.test(tag)) return "bg-foreground";
  return "bg-accent-foreground";
}

export function MostRead({ className = "", showInsightsLink = false }: { className?: string; showInsightsLink?: boolean }) {
  return (
    <Section id="most-read" eyebrow="From the blog" title="Most read on Vertistrat Insights" intro="Ranked by reader engagement, last 90 days." className={className}>
      <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {MOST_READ.map((a, i) => { const article = findArticle(articleSlug(a.url)); if (!article) return null; const Icon = tagIcon(a.tags[0]); return (
          <li key={a.url}>
            <Link to="/insights/$slug" params={{ slug: articleSlug(article.url) }} className="group tile tile-hover flex h-full flex-col overflow-hidden bg-card">
              <span className={`flex h-9 w-full items-center px-5 text-background ${band(a.tags[0])}`} aria-hidden="true"><Icon className="h-4 w-4" strokeWidth={2} /></span>
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-center justify-between">
                  <span className="label-mono text-amber">{String(i + 1).padStart(2, "0")}</span>
                  {a.tags[0] && <span className="label-mono text-muted-foreground">{a.tags[0]}</span>}
                </div>
                <h3 className={`mt-3 font-semibold leading-snug ${i === 0 ? "text-xl" : ""}`}>{a.title}</h3>
                <span className="mt-auto pt-4 text-sm font-medium text-primary">Read →</span>
              </div>
            </Link>
          </li>
        ); })}
      </ol>
      <p className="mt-8 flex flex-wrap gap-6 text-sm font-medium">
        <a href={BLOG_URL} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">All articles →<span className="sr-only"> (opens in new tab)</span></a>
        {showInsightsLink && <Link to="/insights" className="text-primary underline underline-offset-4">All insights →</Link>}
      </p>
    </Section>
  );
}
