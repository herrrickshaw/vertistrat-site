import { createFileRoute } from "@tanstack/react-router";
import {
  Scale, FileSignature, ShieldOff, KeyRound, Globe2, Factory, Laptop, Flame, Landmark, MapPinned, Building2, Ship,
  GraduationCap, FlaskConical, Linkedin, Github, Mail, BookOpen, Briefcase, Lightbulb, Zap,
} from "lucide-react";
import { CTA, Contours, DotGrid, IconChip, IconCluster, PageHero, Section, Tile, pageHead, type Tone } from "@/components/site/ui";
import { CONTACT_EMAIL } from "@/config";

export const Route = createFileRoute("/about")({
  head: () => pageHead("About", "Why VertiStrat exists, the principles we work by, who we work with and the founder who leads engagements.", "/about"),
  component: About,
});

const HIGHLIGHTS: [string, string, string, typeof Flame, Tone, string][] = [
  ["Shell", "2014–2018 · ~USD 7 billion LNG project", "Front-end design and cost engineering for a ~USD 7 billion LNG train expansion; up to USD 40 million saved and a 25% lower CO₂ footprint.", Flame, "primary", "sm:col-span-2"],
  ["Invest India", "2022–2025 · USD 6 billion+ pipeline", "Senior Manager, Oil & Gas — USD 6 billion+ investment pipeline across five states; supported a USD 400 million CBG JV and a USD 110 million ethanol distillery JV.", Landmark, "amber", "sm:col-span-2"],
  ["GITA for MPIDC", "2025 · 13 focus sectors", "Investment strategy across 13 focus sectors; helped ground a ₹289 crore chocolate production facility in Ujjain.", MapPinned, "card", ""],
  ["Ritzenhöfer & Company", "2020 · India tech hub, 550+ hires", "Set up a ~USD 400 million India technology hub for a European insurer, hiring 550+ people.", Building2, "card", ""],
  ["Synergy Marine Group", "2021–2022 · Fleet digitalisation", "Fleet-operations digitalisation and shipping decarbonisation pathways.", Ship, "ink", "sm:col-span-2"],
];

const link = "inline-flex items-center gap-2 rounded-lg border border-ink-border px-3 py-2 text-sm hover:bg-ink-foreground/10";

function About() {
  return (
    <>
      <PageHero eyebrow="About" title={<>Projects stall <span className="highlight">between</span> the layers.</>} line="One team keeps policy, plant, platform and people consistent."
        aside={
          <div className="tile relative overflow-hidden bg-card p-6">
            <DotGrid className="absolute inset-0 text-primary opacity-50" />
            <ul className="relative grid gap-3">
              {[["Plant plan", Factory], ["Incentive file", Landmark], ["IT landscape", Laptop]].map(([t, I]) => {
                const Icon = I as typeof Factory;
                return <li key={t as string} className="flex items-center gap-3 rounded-lg border bg-background p-3"><IconChip icon={Icon} /><span className="font-medium">{t as string}</span></li>;
              })}
            </ul>
            <p className="label-mono relative mt-4 text-center text-primary">Three documents · one team</p>
          </div>
        } />

      <Section id="principles" eyebrow="Principles" title="How we work">
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {([
            ["Recommend with reasons", "One answer, plus what we rejected.", Scale, "primary"],
            ["Scope in writing", "Deliverables agreed before work starts.", FileSignature, "card"],
            ["Independent", "No commissions from vendors or parks.", ShieldOff, "card"],
            ["Hand over", "Your team owns the outputs.", KeyRound, "amber"],
          ] as const).map(([t, d, icon, tone], i) => <li key={t}><Tile icon={icon} tone={tone} kicker={`0${i + 1}`} title={t} line={d} className="min-h-44" /></li>)}
        </ol>
      </Section>

      <Section id="clients" eyebrow="Who we work with" title="Three kinds of client" className="border-y bg-card/40">
        <div className="grid gap-4 md:grid-cols-3">
          {([
            ["Overseas manufacturers", "Entering India or adding capacity.", Globe2, "primary"],
            ["Indian manufacturers", "Expanding, relocating or modernising.", Factory, "card"],
            ["IT services firms", "Delivery centres, GCCs, manufacturing clients.", Laptop, "ink"],
          ] as const).map(([t, d, icon, tone]) => <Tile key={t} icon={icon} tone={tone} title={t} line={d} className="min-h-40" />)}
        </div>
      </Section>

      <Section id="founder" eyebrow="Founder" title="Who leads engagements">
        <div className="grid gap-4 lg:grid-cols-4">
          <div className="tile relative overflow-hidden border-ink-border bg-ink p-6 text-ink-foreground md:p-8 lg:col-span-4">
            <Contours className="text-amber" />
            <IconCluster icons={[Briefcase, GraduationCap, Zap, Globe2]} className="absolute bottom-4 right-6 hidden text-ink-foreground lg:block" />
            <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-5">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl border border-dashed border-ink-muted font-display text-2xl font-bold text-ink-muted" aria-hidden="true">UT</div>
                <div>
                  <h3 className="text-2xl font-semibold">Umashankar Triplicane Dwarakanathan</h3>
                  <p className="mt-1 text-sm text-ink-muted">Founder · Strategy, investment promotion and energy · Chennai, India</p>
                </div>
              </div>
              <ul className="flex flex-wrap gap-2">
                <li><a className={link} href="https://www.linkedin.com/in/umashankar-tdrickshaw-moc/" target="_blank" rel="noopener noreferrer"><Linkedin className="h-4 w-4" aria-hidden="true" />LinkedIn</a></li>
                <li><a className={link} href="https://github.com/herrrickshaw" target="_blank" rel="noopener noreferrer"><Github className="h-4 w-4" aria-hidden="true" />GitHub</a></li>
                <li><a className={`${link} break-all`} href={`mailto:${CONTACT_EMAIL}`}><Mail className="h-4 w-4" aria-hidden="true" />{CONTACT_EMAIL}</a></li>
              </ul>
            </div>
            <p className="relative mt-6 max-w-3xl text-sm text-ink-muted">Chemical engineer (IIT Madras, dual degree) and MBA (ESMT Berlin) with 10+ years across LNG and oil &amp; gas engineering, foreign direct investment promotion and business transformation. He has worked on a ~USD 7 billion LNG project at Shell, managed a USD 6 billion+ oil &amp; gas investment pipeline at Invest India, and led state investment strategy for MPIDC at GITA.</p>
          </div>
          {HIGHLIGHTS.map(([t, l, m, icon, tone, span]) => (
            <div key={t} className={span}><Tile icon={icon} tone={tone} title={t} line={l} more={m} className="min-h-44" /></div>
          ))}
          <div className="sm:col-span-2 lg:col-span-1">
            <Tile href="https://blog.vertistratsolution.com/2026/08/about-author.html" icon={BookOpen} tone="primary" title="Full profile" line="On Vertistrat Insights" className="min-h-44" />
          </div>
        </div>
        <h3 className="label-mono mt-10 text-muted-foreground">Education</h3>
        <ul className="mt-4 grid gap-4 sm:grid-cols-3">
          <li><Tile icon={GraduationCap} tone="card" title="MBA, ESMT Berlin" line="2019" /></li>
          <li><Tile icon={FlaskConical} tone="card" title="B.Tech + M.Tech Chemical Engineering" line="IIT Madras · 2014" /></li>
          <li><Tile icon={Lightbulb} tone="amber" title="Patent IN 426681" /></li>
        </ul>
      </Section>
      <CTA title="A project that crosses layers?" text="Tell us what's decided. We'll say if we can help." />
    </>
  );
}
