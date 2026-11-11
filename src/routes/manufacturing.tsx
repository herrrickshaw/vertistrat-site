import { createFileRoute } from "@tanstack/react-router";
import { SectorTiles } from "@/components/site/Sections";
import { BarChart3, MapPin, FileText, BadgeCheck, Truck, Gauge, Stethoscope, PencilRuler, Rocket, KeyRound } from "lucide-react";
import { CTA, PageHero, Section, StatTile, Tile, bento, pageHead, type Tone } from "@/components/site/ui";

export const Route = createFileRoute("/manufacturing")({
  head: () => pageHead("Manufacturing advisory", "Feasibility, site selection, project reports, approvals and incentives, supply chain localisation and operations improvement for manufacturers in India.", "/manufacturing"),
  component: Manufacturing,
});

const WORK: [string, string, string, typeof MapPin, Tone, string][] = [
  ["Feasibility and entry", "Whether, where and how big.", "Demand, cost and policy context to decide whether, where and how big.", BarChart3, "primary", "sm:col-span-2"],
  ["Site selection", "Shortlist, visit, compare.", "Shortlist states and parks against your criteria, then visit and compare.", MapPin, "card", ""],
  ["Project reports", "Reports lenders can rely on.", "Detailed project reports that lenders, boards and agencies can rely on.", FileText, "amber", ""],
  ["Approvals and incentives", "Map, apply, track.", "Map approvals and schemes, prepare applications, track conditions.", BadgeCheck, "card", ""],
  ["Supply chain localisation", "Qualify local suppliers.", "Identify and qualify local suppliers; plan phased localisation.", Truck, "card", ""],
  ["Operations improvement", "Capacity, layout, quality, cost.", "Capacity, layout, quality and cost improvements in running plants.", Gauge, "ink", "sm:col-span-2"],
];

const PHASES = [
  ["Diagnose", "Decision brief, constraints register, data request list", Stethoscope],
  ["Design", "Options comparison, site shortlist, incentive map, draft project report", PencilRuler],
  ["Deliver", "Final project report, applications filed, supplier shortlist, implementation plan", Rocket],
  ["Hand over", "Compliance calendar, document set, owner list, claims schedule", KeyRound],
] as const;

function Manufacturing() {
  return (
    <>
      <PageHero eyebrow="Practice 01" title="Manufacturing advisory" line="From feasibility to a running plant, on one set of numbers."
        aside={<div className="grid grid-cols-2 gap-4"><StatTile value="6" label="Workstreams" tone="primary" /><StatTile value="4" label="Phases" tone="ink" /><StatTile value="7" label="Sectors" tone="amber" className="col-span-2" /></div>} />
      <Section id="work" eyebrow="Workstreams" title="Six workstreams">
        <ul className={bento}>
          {WORK.map(([t, l, m, icon, tone, span], i) => (
            <li key={t} className={span}><Tile icon={icon} tone={tone} kicker={`W${i + 1}`} title={t} line={l} more={m} /></li>
          ))}
        </ul>
        <p className="label-mono mt-4 text-muted-foreground">Hover or tap a tile for detail</p>
      </Section>
      <Section id="deliverables" eyebrow="Deliverables" title="What you get, per phase" className="border-y bg-card/40">
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PHASES.map(([p, d, icon], i) => (
            <li key={p}><Tile icon={icon} tone={i === 3 ? "amber" : "card"} kicker={`Phase ${i + 1}`} title={p} line="Written deliverables" more={d} /></li>
          ))}
        </ol>
      </Section>
      <Section id="sectors" eyebrow="Sectors" title="Sectors"><SectorTiles count={7} /></Section>
      <CTA title="Choosing a site or scheme?" text="Send your shortlist. We'll say what to check first." />
    </>
  );
}
