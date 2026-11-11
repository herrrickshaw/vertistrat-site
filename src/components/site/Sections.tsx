import { Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight, BadgePercent, Building2, CarFront, ClipboardCheck, Cloud, Cog, Compass, FileText, FlaskConical, Globe2,
  Landmark, ListChecks, MapPin, Map as MapIcon, Microchip, Pill, Plug, Presentation, ReceiptText, ShieldCheck, Ship, Truck, Wheat, Wind,
  type LucideIcon,
} from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { INSIGHT_THEMES, articleSlug } from "@/data/insights";
import { GUIDE_TOPICS, SECTOR_INFO, guideArticles, matchArticles } from "@/lib/guides";
import { IconChip, SECTORS, btn, type Tone } from "./ui";
import { themeIcon } from "./themeIcons";

type To = "/manufacturing" | "/it-services" | "/biofuels-energy" | "/";
const HELP: [string, LucideIcon, To, string?][] = [
  ["Market entry", Compass, "/manufacturing"],
  ["Site selection", MapPin, "/manufacturing"],
  ["Project report (DPR)", FileText, "/manufacturing"],
  ["Approvals & clearances", ClipboardCheck, "/manufacturing"],
  ["Central & state incentives", Landmark, "/", "investment"],
  ["PLI & scheme claims", BadgePercent, "/", "investment"],
  ["Supply-chain localisation", Truck, "/manufacturing"],
  ["Delivery centre / GCC set-up", Building2, "/it-services"],
  ["Industry 4.0 roadmap", MapIcon, "/it-services"],
  ["Vendor selection", ListChecks, "/it-services"],
  ["Investor briefing", Presentation, "/", "investment"],
  ["Aftercare & compliance", ShieldCheck, "/", "investment"],
];

export function HelpGrid() {
  return (
    <ul className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
      {HELP.map(([label, icon, to, hash]) => (
        <li key={label}>
          <Link to={to} {...(hash ? { hash } : {})} className="group tile tile-hover flex h-full items-center gap-3 bg-card p-4">
            <IconChip icon={icon} />
            <span className="flex-1 text-sm font-semibold leading-tight">{label}</span>
            <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
        </li>
      ))}
    </ul>
  );
}

const GUIDE_ICONS: Record<string, LucideIcon> = { company: Building2, incentives: BadgePercent, approvals: ClipboardCheck, land: MapPin, trade: Ship, energy: Plug };
const GUIDE_TONES: Tone[] = ["primary", "card", "card", "amber", "card", "ink"];
const toneCls = (t: Tone) => (t === "ink" ? "border-ink-border bg-ink text-ink-foreground" : t === "primary" ? "bg-primary-soft" : t === "amber" ? "bg-amber-soft" : "bg-card");

export function GuideTiles() {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {GUIDE_TOPICS.map((g, i) => {
        const items = guideArticles(g.key);
        const tone = GUIDE_TONES[i] ?? "card";
        const first = items[0];
        if (!first) return null;
        return (
          <li key={g.key}>
            <Link to="/insights/$slug" params={{ slug: articleSlug(first.url) }} className={`group tile tile-hover flex h-full min-h-36 flex-col p-5 ${toneCls(tone)}`}>
              <div className="flex items-start justify-between">
                <IconChip icon={GUIDE_ICONS[g.key] ?? FileText} tone={tone} />
                <span className={`label-mono ${tone === "ink" ? "text-ink-muted" : "text-muted-foreground"}`}>{items.length} {items.length === 1 ? "article" : "articles"}</span>
              </div>
              <span className="mt-auto pt-5 font-display text-lg font-semibold">{g.label}</span>
              <span className={`mt-1 line-clamp-1 text-sm ${tone === "ink" ? "text-ink-muted" : "text-muted-foreground"}`}>Start: {first?.title}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

const SERVICE_FOR: Record<string, string> = {
  "industrial-policy": "Incentive mapping & approvals",
  energy: "Biofuel & energy project advisory",
  trade: "Market entry & localisation",
  "agri-food": "Food processing plant set-up",
  "capital-climate": "Investor briefing & green finance",
};

export function InsightToAdvisory() {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {INSIGHT_THEMES.map((t) => (
        <li key={t.slug} className="tile flex h-full flex-col bg-card p-5">
          <IconChip icon={themeIcon(t.slug)} />
          <p className="label-mono mt-5 text-muted-foreground">{t.theme}</p>
          <p className="mt-1 font-display font-semibold leading-tight">{SERVICE_FOR[t.slug] ?? "Advisory"}</p>
          <Link to="/" hash="contact" className="mt-auto pt-5 text-sm font-medium text-primary hover:underline">Discuss this →</Link>
        </li>
      ))}
    </ul>
  );
}

const SECTOR_ICONS: LucideIcon[] = [CarFront, Microchip, Cog, Pill, Wheat, FlaskConical, Wind, Globe2, Cloud];
const SECTOR_TONES: Tone[] = ["card", "primary", "card", "amber", "card", "primary", "amber", "card", "primary"];

export function SectorTiles({ count = SECTORS.length }: { count?: number }) {
  const [open, setOpen] = useState<number | null>(null);
  const i = open ?? 0;
  const Icon = SECTOR_ICONS[i] ?? Cog;
  const info = SECTOR_INFO[i];
  const related = matchArticles(info?.pattern ?? null);
  return (
    <>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SECTORS.slice(0, count).map((s, n) => {
          const tone = SECTOR_TONES[n] ?? "card";
          return (
            <li key={s}>
              <button type="button" onClick={() => setOpen(n)} aria-haspopup="dialog"
                className={`group tile tile-hover flex w-full items-center gap-4 p-4 text-left ${toneCls(tone)}`}>
                <IconChip icon={SECTOR_ICONS[n] ?? Cog} tone={tone} />
                <span className="flex-1 font-display font-semibold leading-tight">{s}</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </button>
            </li>
          );
        })}
      </ul>
      <Sheet open={open !== null} onOpenChange={(o) => !o && setOpen(null)}>
        <SheetContent className="overflow-y-auto">
          <SheetHeader className="text-left">
            <IconChip icon={Icon} tone="primary" size="lg" />
            <SheetTitle className="pt-3 text-2xl">{SECTORS[i]}</SheetTitle>
            <SheetDescription>{info?.blurb}</SheetDescription>
          </SheetHeader>
          {related.length > 0 && (
            <div className="mt-6">
              <p className="label-mono text-muted-foreground">Related insights</p>
              <ul className="mt-3 grid gap-2">
                {related.map((a) => (
                  <li key={a.url}>
                    <Link to="/insights/$slug" params={{ slug: articleSlug(a.url) }} className="flex gap-2 rounded-lg border p-3 text-sm hover:border-primary">
                      <ReceiptText className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                      <span>{a.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link to="/" hash="contact" onClick={() => setOpen(null)} className={btn.primary}>Talk to us</Link>
            {i === 6 && <Link to="/biofuels-energy" onClick={() => setOpen(null)} className="text-sm font-medium text-primary hover:underline">See the practice →</Link>}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

export function TalkStrip() {
  return (
    <section aria-label="Talk to our team" className="border-b border-ink-border bg-ink text-ink-foreground">
      <div className="container-site flex flex-col items-start gap-4 py-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-display text-lg font-semibold">Talk to our team about your project.</p>
        <Link to="/" hash="contact" className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:opacity-95">
          Talk to our team <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
