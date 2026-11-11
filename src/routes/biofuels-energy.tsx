import { createFileRoute, Link } from "@tanstack/react-router";
import { Fuel, Flame, Plane, FlaskConical, Wheat, Zap, Sprout, Microscope, FileText, BadgeCheck, Leaf, ShieldCheck, Stethoscope, PencilRuler, Rocket, KeyRound, type LucideIcon } from "lucide-react";
import { CTA, PageHero, Section, StatTile, Tile, bento, pageHead, type Tone } from "@/components/site/ui";
import { themeIcon } from "@/components/site/themeIcons";
import { INSIGHT_THEMES, articleSlug, formatInsightDate, type InsightItem } from "@/data/insights";
import { energyPracticeArticles } from "@/lib/guides";

export const Route = createFileRoute("/biofuels-energy")({
  head: () => pageHead("Biofuels, biochemicals & energy advisory", "Feedstock, technology, project reports, policy and carbon accounting for ethanol, compressed biogas, sustainable aviation fuel and bio-based chemicals in India.", "/biofuels-energy"),
  component: BiofuelsEnergy,
});

type WorkTile = [string, string, string, LucideIcon, Tone, string];
const PRODUCTS: WorkTile[] = [
  ["Ethanol", "Grain and cane routes.", "Grain, molasses and cane-juice distilleries for blending programmes.", Fuel, "primary", "sm:col-span-2"],
  ["Compressed biogas", "Waste to gas.", "Agri residue, press mud and municipal waste to CBG and organic manure.", Flame, "card", ""],
  ["Sustainable aviation fuel", "Pathways and readiness.", "Alcohol-to-jet, HEFA and co-processing routes; fuel-spec and certification readiness.", Plane, "amber", ""],
  ["Bio-based chemicals", "Beyond fuel.", "Isobutanol, bio-solvents and other chemicals from the same feedstock.", FlaskConical, "card", ""],
  ["Integrated biorefineries", "Use every by-product.", "Combine fuel, food-grade and feed products from one feedstock stream.", Wheat, "card", ""],
  ["Energy transition", "Fuel, power, storage.", "Blending economics, captive renewable power and storage for process plants.", Zap, "ink", "sm:col-span-2"],
];
const WORK: WorkTile[] = [
  ["Feedstock and offtake", "Secure supply, sign buyers.", "Feedstock availability and price, aggregation logistics, offtake and pricing terms.", Sprout, "primary", "sm:col-span-2"],
  ["Technology screening", "Compare process routes.", "Yields, utilities, capex and licensors compared on one basis.", Microscope, "card", ""],
  ["Project reports", "Reports lenders can rely on.", "Detailed project reports for lenders, boards and agencies.", FileText, "amber", ""],
  ["Policy and schemes", "Mandates, schemes, pricing.", "Blending targets, CBG and SAF policy, central and state incentives.", BadgeCheck, "card", ""],
  ["Carbon accounting", "Lifecycle emissions.", "Carbon-intensity calculations and readiness for certification schemes.", Leaf, "card", ""],
  ["Clearances", "Environment and safety.", "Environmental clearance, zero-liquid-discharge and consent conditions.", ShieldCheck, "ink", "sm:col-span-2"],
];
const PHASES = [
  ["Diagnose", "Feedstock brief, constraints register, data request list", Stethoscope],
  ["Design", "Route comparison, site and feedstock map, scheme map, draft project report", PencilRuler],
  ["Deliver", "Final project report, applications filed, offtake term sheet, implementation plan", Rocket],
  ["Hand over", "Compliance calendar, carbon-intensity file, owner list, claims schedule", KeyRound],
] as const;
const BANDS = ["bg-primary", "bg-amber", "bg-accent-foreground", "bg-success", "bg-foreground"];

function ReadingCard({ item }: { item: InsightItem }) {
  const index = INSIGHT_THEMES.findIndex((theme) => theme.items.some((article) => article.url === item.url));
  const Icon = themeIcon(INSIGHT_THEMES[index]?.slug ?? "energy");
  return (
    <Link to="/insights/$slug" params={{ slug: articleSlug(item.url) }} className="group block h-full rounded-xl">
      <div className="tile tile-hover flex h-full flex-col overflow-hidden bg-card">
        <span aria-hidden="true" className={`flex h-9 items-center px-5 text-background ${BANDS[index] ?? "bg-primary"}`}><Icon className="h-4 w-4" strokeWidth={2} /></span>
        <div className="flex flex-1 flex-col p-5">
          <time dateTime={item.published} className="label-mono text-muted-foreground">{formatInsightDate(item.published)}</time>
          <h3 className="mt-2 font-semibold leading-snug">{item.title}</h3>
          <div className="reveal"><div><p className="pt-2 text-sm text-muted-foreground">{item.excerpt}</p></div></div>
          <p className="mt-auto pt-4 text-sm font-medium text-primary">Read →</p>
        </div>
      </div>
    </Link>
  );
}

function BiofuelsEnergy() {
  return (
    <>
      <PageHero eyebrow="Practice 03" title="Biofuels, biochemicals & energy" line="From feedstock to offtake, on one set of numbers."
        aside={<div className="grid grid-cols-2 gap-4"><StatTile value="6" label="Workstreams" tone="primary" /><StatTile value="6" label="Products" tone="ink" /><StatTile value="4" label="Phases" tone="amber" className="col-span-2" /></div>} />
      <Section id="products" eyebrow="Products" title="What we cover">
        <ul className={bento}>{PRODUCTS.map(([title, line, more, icon, tone, span]) => <li key={title} className={span}><Tile icon={icon} tone={tone} title={title} line={line} more={more} /></li>)}</ul>
      </Section>
      <Section id="work" eyebrow="Workstreams" title="Six workstreams" className="border-y bg-card/40">
        <ul className={bento}>{WORK.map(([title, line, more, icon, tone, span], i) => <li key={title} className={span}><Tile icon={icon} tone={tone} kicker={`W${i + 1}`} title={title} line={line} more={more} /></li>)}</ul>
      </Section>
      <Section id="deliverables" eyebrow="Deliverables" title="What you get, per phase">
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{PHASES.map(([title, more, icon], i) => <li key={title}><Tile icon={icon} tone={i === 3 ? "amber" : "card"} kicker={`Phase ${i + 1}`} title={title} line="Written deliverables" more={more} /></li>)}</ol>
      </Section>
      <Section id="read-more" eyebrow="From the blog" title="Read more" className="border-t">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{energyPracticeArticles().slice(0, 6).map((item) => <li key={item.url}><ReadingCard item={item} /></li>)}</ul>
      </Section>
      <CTA title="Planning a biofuel or biochemical plant?" text="Send your feedstock and location. We'll say what to check first." />
    </>
  );
}