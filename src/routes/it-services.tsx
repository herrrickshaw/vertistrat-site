import { createFileRoute } from "@tanstack/react-router";
import {
  Building2, Factory, Laptop, Landmark, UserPlus, Repeat, Target, Map as MapIcon, ListChecks, ClipboardCheck, ShieldCheck, Users, SearchCheck, Wrench, Eye, Server,
} from "lucide-react";
import { CTA, IconChip, PageHero, Section, StatTile, Tile, pageHead } from "@/components/site/ui";

export const Route = createFileRoute("/it-services")({
  head: () => pageHead("IT services advisory", "Delivery centre and GCC set-up for IT services firms; Industry 4.0 roadmaps, vendor selection and programme governance for manufacturers.", "/it-services"),
  component: ITServices,
});

const AUD = [
  { t: "IT services firms", icon: Server, tone: "primary" as const, items: [["Delivery centre and GCC set-up", Building2], ["Entity structure and incentives", Landmark], ["Hiring plan", UserPlus], ["Build-operate-transfer", Repeat], ["Go-to-market into manufacturing", Target]] as const },
  { t: "Manufacturers", icon: Factory, tone: "amber" as const, items: [["Industry 4.0 roadmap", MapIcon], ["Vendor selection", ListChecks], ["Programme governance", ClipboardCheck], ["Cloud, data and cyber readiness", ShieldCheck], ["Change management", Users]] as const },
];

function ITServices() {
  return (
    <>
      <PageHero eyebrow="Practice 02" title="IT services advisory" line="Delivery capacity in India, and technology that works on the plant floor."
        aside={<div className="grid grid-cols-2 gap-4"><StatTile value="2" label="Audiences" tone="primary" /><StatTile value="3" label="Engagement models" tone="ink" /></div>} />
      <Section id="audiences" eyebrow="Who it's for" title="Two audiences">
        <div className="grid gap-4 lg:grid-cols-2">
          {AUD.map((a) => (
            <div key={a.t} className="grid gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2"><Tile big icon={a.icon} tone={a.tone} title={a.t} className="min-h-40" /></div>
              {a.items.map(([i, Icon], n) => (
                <div key={i} className={`tile flex items-center gap-3 bg-card p-4 ${n === 4 ? "sm:col-span-2" : ""}`}>
                  <IconChip icon={Icon} />
                  <span className="font-medium leading-tight">{i}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </Section>
      <Section id="models" eyebrow="Engagement models" title="Three ways to work with us" className="border-y bg-card/40">
        <ol className="grid gap-4 md:grid-cols-3">
          {([
            ["Assess", "Fixed scope, written recommendation.", SearchCheck, "card"],
            ["Set up", "We run it with you until it operates.", Wrench, "primary"],
            ["Assure", "Independent oversight of others' delivery.", Eye, "ink"],
          ] as const).map(([t, d, icon, tone], i) => <li key={t}><Tile icon={icon} tone={tone} kicker={`0${i + 1}`} title={t} line={d} className="min-h-44" /></li>)}
        </ol>
      </Section>
      <CTA title="Planning a centre or programme?" text="Share the brief. We'll reply with a scope." />
    </>
  );
}
