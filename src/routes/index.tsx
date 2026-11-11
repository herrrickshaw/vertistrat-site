import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Factory, Server, Landmark, Cpu, Users, HandCoins, Presentation, Cog, Truck, Package, Code2, ShieldCheck, Cloud, FileCheck2, MapPin, ScrollText, Network, Send, MessageSquare, AtSign, BadgePercent, Handshake, LifeBuoy,
  Stethoscope, PencilRuler, Rocket, KeyRound, Mail, Fuel, Leaf, FlaskConical, Plane, Zap,
} from "lucide-react";
import { Contours, DotGrid, Eyebrow, IconChip, IconCluster, PageHero, PlantLine, Section, StatTile, Tile, btn, pageHead, type Tone } from "@/components/site/ui";
import { MostRead } from "@/components/site/MostRead";
import { GuideTiles, HelpGrid, SectorTiles } from "@/components/site/Sections";
import { ContactForm } from "@/components/site/ContactForm";
import { CONTACT_EMAIL, CONTACT_PHONE_DISPLAY, CONTACT_PHONE_TEL, OFFICE_ADDRESS_LINES, OFFICE_MAP_URL, OFFICE_MAP_EMBED_URL } from "@/config";

export const Route = createFileRoute("/")({
  head: () => pageHead("Manufacturing, IT and investment advisory", "VertiStrat connects policy, plant, platform and people: advisory for manufacturers, IT services firms and investors setting up in India.", "/"),
  component: Home,
});

const LAYERS: [string, string, string, typeof Landmark, Tone][] = [
  ["L4", "Policy", "Incentives and approvals", Landmark, "amber"],
  ["L3", "Plant", "Site and capacity", Factory, "primary"],
  ["L2", "Platform", "IT, data, cyber", Cpu, "card"],
  ["L1", "People", "Hiring and skills", Users, "ink"],
];

const INVEST = [["Briefing", Presentation], ["Incentives", BadgePercent], ["Liaison", Handshake], ["Aftercare", LifeBuoy]] as const;
const STEPS = [
  ["Diagnose", "Understand the decision and constraints.", Stethoscope],
  ["Design", "Options, costs, risks. One recommendation.", PencilRuler],
  ["Deliver", "Run workstreams and applications.", Rocket],
  ["Hand over", "Documents, owners, calendar. We step back.", KeyRound],
] as const;

function Home() {
  return (
    <>
      <PageHero
        eyebrow="Manufacturing · IT services · Biofuels & energy · Investment"
        title={<>From the <span className="highlight">policy desk</span> to the plant floor.</>}
        line="One team for the plan, the incentives and the IT."
        aside={
          <div className="tile relative overflow-hidden bg-card p-4 sm:p-6">
            
            <ul aria-label="The four layers we advise on" className="relative grid grid-cols-2 gap-3 sm:gap-4">
              {LAYERS.map(([k, t, d, icon, tone]) => (
                <li key={k}><Tile icon={icon} tone={tone} kicker={k} title={t} line={d} className="min-h-40" /></li>
              ))}
            </ul>
            <IconCluster icons={[ScrollText, Network, Factory, Users]} className="absolute bottom-[8.25rem] left-12 hidden origin-bottom-left scale-75 text-primary sm:block" />
            <PlantLine className="relative mt-4 w-full text-muted-foreground opacity-70" />
          </div>
        }
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/" hash="contact" className={btn.primary}>Discuss a project</Link>
          <Link to="/insights" className={btn.outline}>Insights</Link>
        </div>
        <ul aria-label="Practices" className="mt-6 flex flex-wrap gap-2">
          {["Manufacturing", "IT services", "Biofuels & energy", "Investment facilitation"].map((b) => (
            <li key={b} className="rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">{b}</li>
          ))}
        </ul>
      </PageHero>

      <Section id="services" eyebrow="Services" title="Three practices, one team">
        <div className="grid gap-4 lg:grid-cols-3">
          <div>
            <Tile big to="/manufacturing" icon={Factory} cluster={[Cog, Truck, Package, Factory]} tone="primary" kicker="01" title="Manufacturing advisory" line="Feasibility, sites, incentives, supply chain." className="min-h-64"
              decor={<DotGrid className="absolute -bottom-6 -right-40 h-40 w-40 text-primary" />} />
          </div>
          <div>
            <Tile big to="/it-services" icon={Server} cluster={[Code2, ShieldCheck, Cloud, Server]} tone="card" kicker="02" title="IT services advisory" line="Delivery centres, GCCs, Industry 4.0." className="min-h-64"
              decor={<DotGrid className="absolute -bottom-6 -right-40 h-40 w-40 text-amber" />} />
          </div>
          <div>
            <Tile big to="/biofuels-energy" icon={Fuel} cluster={[Leaf, FlaskConical, Plane, Zap]} tone="amber" kicker="03" title="Biofuels, biochemicals & energy" line="Ethanol, CBG, SAF and biochemicals." className="min-h-64"
              decor={<DotGrid className="absolute -bottom-6 -right-40 h-40 w-40 text-amber" />} />
          </div>
        </div>
      </Section>

      <Section id="help" eyebrow="What we help with" title="Twelve ways we help" className="pt-0 md:pt-0">
        <HelpGrid />
      </Section>

      <section id="investment" aria-labelledby="inv-h" className="scroll-mt-16 bg-ink py-16 text-ink-foreground md:py-24">
        <div className="container-site">
          <p className="label-mono flex items-center gap-2 text-ink-muted"><span className="h-1.5 w-1.5 bg-amber" aria-hidden="true" />Investment facilitation</p>
          <h2 id="inv-h" className="mt-3 mb-8 text-3xl font-semibold md:text-4xl">Briefing to aftercare</h2>
          <div className="tile relative overflow-hidden border-ink-border bg-ink-raised p-6 text-ink-foreground md:p-10">
            <Contours className="text-amber" />
            <IconCluster icons={[Landmark, FileCheck2, HandCoins, MapPin]} className="absolute left-[19rem] top-4 hidden origin-top-left scale-75 text-ink-foreground lg:block" />
            <div className="relative grid gap-6 lg:grid-cols-[1fr_2fr] lg:items-center">
              <div>
                <IconChip icon={HandCoins} tone="raised" size="lg" />
                <h3 className="mt-4 text-2xl font-semibold">Investment facilitation</h3>
                <p className="mt-1.5 text-sm text-ink-muted">Independent adviser. Not a government agency.</p>
              </div>
              <ol className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {INVEST.map(([t, Icon], i) => (
                  <li key={t} className="rounded-lg border border-ink-border bg-ink-foreground/5 p-4">
                    <div className="flex items-center justify-between">
                      <Icon className="h-5 w-5 text-amber" aria-hidden="true" />
                      <span className="label-mono text-ink-muted">0{i + 1}</span>
                    </div>
                    <p className="mt-4 font-display font-semibold">{t}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section aria-label="What clients get" className="py-16 md:py-24">
        <div className="container-site">
          <Eyebrow>What you get</Eyebrow>
          <ul className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              ["Manufacturing", "A site, scheme and project report on one set of numbers."],
              ["IT services", "A delivery centre or programme that runs on the plant floor."],
              ["Biofuels & energy", "Feedstock, route and offtake settled before you commit capital."],
              ["Investment facilitation", "Incentives mapped, filed and tracked after you start."],
            ].map(([p, q]) => (
              <li key={p} className="tile flex flex-col bg-card p-8">
                <span aria-hidden="true" className="font-display text-5xl leading-none text-primary">“</span>
                <p className="mt-2 text-xl font-medium leading-snug">{q}</p>
                <p className="label-mono mt-auto pt-6 text-muted-foreground">{p}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Section id="approach" eyebrow="Approach" title="Four steps, each written down" className="border-y bg-card/40">
        <ol className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <span aria-hidden="true" className="absolute left-6 right-6 top-11 hidden h-px bg-gradient-to-r from-primary via-amber to-primary lg:block" />
          {STEPS.map(([t, d, icon], i) => (
            <li key={t} className="relative"><Tile icon={icon} tone={i === 3 ? "amber" : "card"} kicker={`Step ${i + 1}`} title={t} line={d} /></li>
          ))}
        </ol>
        <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatTile value="3" label="Practices" tone="primary" />
          <StatTile value="4" label="Steps" />
          <StatTile value="4" label="Layers" />
          <StatTile value="9" label="Sectors" tone="ink" />
        </div>
      </Section>

      <Section id="sectors" eyebrow="Sectors" title="Where we work">
        <SectorTiles />
      </Section>

      <Section id="doing-business" eyebrow="Doing business in India" title="Start with the basics" className="border-t">
        <GuideTiles />
        <Link to="/insights" hash="guide" className="mt-6 inline-block text-sm font-medium text-primary hover:underline">Full guide on Insights →</Link>
      </Section>

      <MostRead className="border-t" showInsightsLink />

      <section id="contact" aria-labelledby="contact-h" className="bg-ink py-16 text-ink-foreground md:py-24">
        <div className="container-site">
          <p className="label-mono flex items-center gap-2 text-ink-muted"><span className="h-1.5 w-1.5 bg-amber" aria-hidden="true" />Contact</p>
          <h2 id="contact-h" className="mt-3 mb-8 text-3xl font-semibold md:text-4xl">Start a conversation</h2>
        <div className="grid gap-4 lg:grid-cols-[1fr_2fr]">
          <div className="tile relative flex flex-col overflow-hidden border-ink-border bg-ink-raised p-8 text-ink-foreground lg:sticky lg:top-24 lg:h-fit">
            <Contours className="text-amber" />
            <IconCluster icons={[Send, MessageSquare, AtSign]} className="absolute right-6 top-6 text-ink-foreground" />
            <IconChip icon={Mail} tone="raised" size="lg" />
            <h3 className="relative mt-6 text-2xl font-semibold">Tell us what you're deciding</h3>
            <p className="relative mt-2 text-sm text-ink-muted">A short note is enough.</p>
            <a className="relative mt-6 break-all font-medium text-amber underline underline-offset-4" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            <div className="relative mt-2">
              <a className="inline-block font-medium text-amber underline underline-offset-4" href={`tel:${CONTACT_PHONE_TEL}`}>{CONTACT_PHONE_DISPLAY}</a>
            </div>
          </div>
          <div className="tile bg-card p-3 text-card-foreground md:p-4"><ContactForm /></div>
        </div>
          <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_2fr]">
            <div className="tile min-w-0 border-ink-border bg-ink-raised p-6 text-ink-foreground md:p-8">
              <IconChip icon={MapPin} tone="raised" size="lg" />
              <h3 className="mt-5 text-2xl font-semibold">Visit us</h3>
              <address className="mt-3 text-sm not-italic leading-relaxed text-ink-muted">
                {OFFICE_ADDRESS_LINES.map((line) => <span key={line} className="block">{line}</span>)}
              </address>
              <a href={OFFICE_MAP_URL} target="_blank" rel="noopener noreferrer" className="mt-5 inline-block text-sm font-medium text-amber underline underline-offset-4">Open in Google Maps ↗</a>
            </div>
            <div className="tile min-w-0 overflow-hidden border-ink-border bg-ink-raised">
              <iframe src={OFFICE_MAP_EMBED_URL} title="VertiStrat office location on Google Maps" loading="lazy" referrerPolicy="no-referrer-when-downgrade" height="320" className="block h-80 w-full border-0" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
