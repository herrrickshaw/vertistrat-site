import { createFileRoute, Link, notFound, redirect } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PostBody } from "@/components/site/PostBody";
import { Button } from "@/components/ui/button";
import { CTA, Section, pageHead } from "@/components/site/ui";
import { INSIGHT_THEMES, LIBRARY, LIBRARY_THEMES, articleSlug, findArticle, formatInsightDate } from "@/data/insights";
import { BLOG_POST_FEED_BASE } from "@/config";
import { jsonp } from "@/lib/jsonp";
import { hasInteractiveCharts } from "@/lib/sanitizePost";
import retiredSlugs from "@/data/retiredSlugs.json";

// Posts merged into another or moved to draft on the blog: send old links to the post that replaced them.
const RETIRED = retiredSlugs as Record<string, string | null>;

export const Route = createFileRoute("/insights/$slug")({
  loader: ({ params }) => {
    const article = findArticle(params.slug);
    if (!article) {
      const target = RETIRED[params.slug];
      if (target && findArticle(target))
        throw redirect({ to: "/insights/$slug", params: { slug: target }, statusCode: 301 });
      throw notFound();
    }
    return article;
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Article unavailable | VertiStrat Solutions LLP" }, { name: "robots", content: "noindex" }] };
    const head = pageHead(loaderData.title, loaderData.excerpt, `https://vertistratsolution.com/insights/${articleSlug(loaderData.url)}`);
    return { ...head, meta: head.meta.map((meta) => meta.property === "og:type" ? { ...meta, content: "article" } : meta), links: [{ rel: "canonical", href: loaderData.url }] };
  },
  component: ArticlePage,
  notFoundComponent: () => <section className="container-site py-32 text-center"><h1 className="text-6xl font-bold">404</h1><p className="mt-4 text-muted-foreground">This page doesn't exist.</p><Button asChild className="mt-6"><Link to="/insights">← Insights</Link></Button></section>,
  errorComponent: () => <section className="container-site py-24"><h1 className="text-3xl">Couldn't load the article here.</h1><Button asChild className="mt-6"><Link to="/insights">← Insights</Link></Button></section>,
});

type PostFeed = { entry?: { content?: { $t?: string } } };

function ArticlePage() {
  const article = Route.useLoaderData();
  const theme = INSIGHT_THEMES.find((theme) => theme.items.some((item) => item.url === article.url));
  const query = useQuery({
    queryKey: ["blog-post", article.postId],
    queryFn: async () => {
      const feed = await jsonp(`${BLOG_POST_FEED_BASE}/${article.postId}?alt=json-in-script`) as PostFeed;
      const html = feed.entry?.content?.$t;
      if (!html) throw new Error("Missing post content");
      return html;
    },
    enabled: typeof window !== "undefined",
    staleTime: 0,
    retry: false,
  });
  const slug = articleSlug(article.url);
  const libTheme = theme ? undefined : LIBRARY.find((a) => articleSlug(a.url) === slug)?.theme;
  const themeName = theme?.theme ?? LIBRARY_THEMES.find((t) => t.slug === libTheme)?.name;
  const related = theme ? theme.items.filter((item) => item.url !== article.url).slice(0, 3)
    : LIBRARY.filter((a) => a.theme === libTheme && articleSlug(a.url) !== slug).slice(0, 3);
  return (
    <>
      <article className="container-site min-w-0 py-12 md:py-20">
        <header className="mb-8 max-w-4xl">
          <Link to="/insights" className="text-sm font-medium text-primary hover:underline">← Insights</Link>
          <p className="label-mono mt-8 text-muted-foreground">{themeName}</p>
          <h1 className="mt-4 break-words text-3xl font-bold leading-tight md:text-5xl">{article.title}</h1>
          <p className="mt-5 text-sm text-muted-foreground"><time dateTime={article.published}>{formatInsightDate(article.published)}</time> · By Umashankar Triplicane Dwarakanathan</p>
          <a href={article.url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-sm text-primary hover:underline">Originally published on Vertistrat Insights ↗</a>
        </header>
        {query.isPending ? <div role="status" aria-label="Loading article" aria-busy="true" className="tile space-y-5 bg-card p-8"><div className="h-8 w-3/4 animate-pulse bg-muted" /><div className="h-4 w-full animate-pulse bg-muted" /><div className="h-4 w-5/6 animate-pulse bg-muted" /><div className="h-64 animate-pulse bg-muted" /></div> : query.isError ?
          <div role="alert" className="tile bg-card p-8"><p>Couldn't load the article here.</p><Button asChild className="mt-4 h-auto whitespace-normal py-3"><a href={article.url} target="_blank" rel="noopener noreferrer">Read on Vertistrat Insights ↗</a></Button></div> : <>
            {hasInteractiveCharts(query.data) && <p className="mb-4 text-sm text-muted-foreground">This article has interactive charts. <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-primary underline">View them on Vertistrat Insights ↗</a></p>}
            <PostBody html={query.data} />
          </>}
      </article>
      <CTA title="Discuss this" text="Tell us what you're deciding." />
      {related.length > 0 && <Section id="related" eyebrow={themeName ?? "Insights"} title="Related articles"><ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{related.map((item) => <li key={item.url}><Link to="/insights/$slug" params={{ slug: articleSlug(item.url) }} className="tile tile-hover flex h-full flex-col bg-card p-5"><h3 className="font-semibold">{item.title}</h3><span className="mt-auto pt-4 text-sm text-primary">Read →</span></Link></li>)}</ul></Section>}
    </>
  );
}