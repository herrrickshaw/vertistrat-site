import { Link, type LinkProps } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  ArrowUpRight, type LucideIcon,
} from "lucide-react";

export function Logo() {
  return (
    <span className="inline-flex items-center gap-2.5">
      <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
        <rect x="0" y="13" width="5" height="9" rx="1" className="fill-primary" />
        <rect x="8" y="7" width="5" height="15" rx="1" className="fill-primary" />
        <rect x="16" y="0" width="5" height="22" rx="1" className="fill-amber" />
      </svg>
      <span className="font-display text-lg font-bold tracking-tight">VertiStrat</span>
    </span>
  );
}

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`label-mono flex items-center gap-2 text-muted-foreground ${className}`}>
      <span className="h-1.5 w-1.5 bg-amber" aria-hidden="true" />
      {children}
    </p>
  );
}

export function Section({ id, eyebrow, title, intro, children, className = "" }: {
  id?: string; eyebrow?: string; title?: ReactNode; intro?: ReactNode; children: ReactNode; className?: string;
}) {
  return (
    <section id={id} aria-labelledby={id ? `${id}-h` : undefined} className={`py-16 md:py-24 ${className}`}>
      <div className="container-site">
        {(eyebrow || title) && (
          <header className="mb-8 max-w-2xl">
            {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
            {title && <h2 id={id ? `${id}-h` : undefined} className="mt-3 text-3xl font-semibold md:text-4xl">{title}</h2>}
            {intro && <p className="mt-3 text-muted-foreground">{intro}</p>}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`tile bg-card p-6 text-card-foreground ${className}`}>{children}</div>;
}

export function Chips({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((s) => (
        <li key={s} className="rounded-sm border bg-card px-3 py-1.5 text-sm">{s}</li>
      ))}
    </ul>
  );
}

export function Placeholder({ children }: { children: ReactNode }) {
  return <span className="label-mono rounded-sm border border-dashed border-amber px-1.5 py-0.5 text-amber">{children}</span>;
}

export const btn = {
  primary: "inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-sm transition hover:-translate-y-0.5 hover:opacity-95",
  outline: "inline-flex items-center justify-center gap-2 rounded-xl border bg-card px-5 py-3 text-sm font-medium transition hover:-translate-y-0.5 hover:bg-muted",
};

/* ---------- Tiles ---------- */

export type Tone = "card" | "primary" | "amber" | "ink" | "raised";

const TONE: Record<Tone, string> = {
  card: "bg-card text-card-foreground",
  primary: "bg-primary-soft text-foreground",
  amber: "bg-amber-soft text-foreground",
  ink: "bg-ink text-ink-foreground border-ink-border",
  raised: "bg-ink-raised text-ink-foreground border-ink-border",
};
const CHIP: Record<Tone, string> = {
  card: "bg-primary-soft text-primary",
  primary: "bg-primary text-primary-foreground",
  amber: "bg-amber text-amber-foreground",
  ink: "bg-ink-border text-amber",
  raised: "bg-primary text-primary-foreground",
};
export const muted = (t: Tone) => (t === "ink" || t === "raised" ? "text-ink-muted" : "text-muted-foreground");

export function IconChip({ icon: Icon, tone = "card", size = "md" }: { icon: LucideIcon; tone?: Tone; size?: "md" | "lg" }) {
  const s = size === "lg" ? "h-14 w-14" : "h-11 w-11";
  return (
    <span className={`inline-flex ${s} shrink-0 items-center justify-center rounded-lg ${CHIP[tone]}`} aria-hidden="true">
      <Icon className={size === "lg" ? "h-7 w-7" : "h-5 w-5"} strokeWidth={1.75} />
    </span>
  );
}

type TileProps = {
  icon?: LucideIcon; title: ReactNode; line?: ReactNode; more?: ReactNode; tone?: Tone; className?: string;
  kicker?: ReactNode; children?: ReactNode; cluster?: LucideIcon[]; to?: LinkProps["to"]; hash?: string; href?: string; decor?: ReactNode; big?: boolean;
};

export function Tile({ icon, title, line, more, tone = "card", className = "", kicker, children, to, hash, href, decor, big, cluster }: TileProps) {
  const [open, setOpen] = useState(false);
  const linked = Boolean(to || href);
  const base = `group tile relative flex h-full flex-col overflow-hidden p-5 md:p-6 ${TONE[tone]} ${linked ? "tile-hover" : ""} ${className}`;
  const inner = (
    <>
      {decor}
      {cluster && <IconCluster icons={cluster} className={`absolute right-6 top-16 ${tone === "ink" || tone === "raised" ? "text-ink-foreground" : "text-primary"}`} />}
      <div className="relative flex items-start justify-between gap-3">
        {icon && <IconChip icon={icon} tone={tone} size={big ? "lg" : "md"} />}
        {kicker && <span className={`label-mono ${tone === "ink" || tone === "raised" ? "text-amber" : "text-primary"}`}>{kicker}</span>}
        {linked && !kicker && <ArrowUpRight className={`h-5 w-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 ${muted(tone)}`} aria-hidden="true" />}
      </div>
      <div className="relative mt-auto pt-6">
        <h3 className={`font-semibold leading-tight ${big ? "text-2xl md:text-3xl" : "text-lg"}`}>{title}</h3>
        {line && <p className={`mt-1.5 text-sm ${muted(tone)}`}>{line}</p>}
        {more && <div className="reveal"><div><p className={`pt-3 text-sm ${muted(tone)}`}>{more}</p></div></div>}
        {children}
      </div>
    </>
  );
  if (to) return <Link to={to} {...(hash ? { hash } : {})} className={base}>{inner}</Link>;
  if (href) return <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className={base}>{inner}</a>;
  if (more)
    return (
      <div className={`${base} cursor-pointer`} data-open={open} tabIndex={0} role="button" aria-expanded={open}
        onClick={() => setOpen(!open)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setOpen(!open); } }}>
        {inner}
      </div>
    );
  return <div className={base}>{inner}</div>;
}

// Loose, low-opacity cluster of related icons for empty tile corners.
const SPOTS = ["left-0 top-0 h-7 w-7 -rotate-6", "left-10 top-6 h-10 w-10", "left-1 top-14 h-6 w-6 rotate-12", "left-[4.5rem] top-0 h-6 w-6 rotate-6", "left-[4.75rem] top-[4.25rem] h-7 w-7 -rotate-12"];
export function IconCluster({ icons, className = "" }: { icons: LucideIcon[]; className?: string }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none h-28 w-28 opacity-25 ${className}`}>
      {icons.slice(0, 5).map((I, i) => <I key={i} strokeWidth={1.25} className={`absolute ${SPOTS[i]}`} />)}
    </div>
  );
}

export function StatTile({ value, label, tone = "card", className = "" }: { value: string; label: string; tone?: Tone; className?: string }) {
  return (
    <div className={`tile relative flex h-full flex-col justify-between overflow-hidden p-5 ${TONE[tone]} ${className}`}>
      <DotGrid className={`absolute -right-4 -top-4 h-24 w-24 ${tone === "ink" ? "text-ink-muted" : "text-primary"}`} />
      <p className="relative font-display text-5xl font-bold leading-none md:text-6xl">{value}</p>
      <p className={`label-mono relative mt-4 ${muted(tone)}`}>{label}</p>
    </div>
  );
}

export function DotGrid({ className = "" }: { className?: string }) {
  return <div aria-hidden="true" className={`dot-grid pointer-events-none ${className}`} />;
}

export function Contours({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 400 300" fill="none" preserveAspectRatio="xMaxYMid slice" className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}>
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <path key={i} d={`M ${-20} ${240 - i * 26} C 90 ${200 - i * 30}, 160 ${290 - i * 34}, 260 ${210 - i * 28} S 380 ${150 - i * 22}, 430 ${170 - i * 24}`}
          stroke="currentColor" strokeWidth="1" opacity={0.18 + i * 0.04} />
      ))}
    </svg>
  );
}

export function PageHero({ eyebrow, title, line, children, aside }: { eyebrow: string; title: ReactNode; line?: string; children?: ReactNode; aside?: ReactNode }) {
  return (
    <section className="relative overflow-hidden border-b">
      <div className="mesh absolute inset-0" aria-hidden="true" />
      <DotGrid className="absolute right-0 top-0 hidden h-full w-1/3 text-primary opacity-60 md:block" />
      <div className={`container-site relative grid gap-10 py-14 md:py-20 ${aside ? "lg:grid-cols-[1.2fr_1fr] lg:items-center" : ""}`}>
        <div className="fade-up">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-6xl">{title}</h1>
          {line && <p className="mt-5 max-w-xl text-lg text-muted-foreground">{line}</p>}
          {children}
        </div>
        {aside}
      </div>
    </section>
  );
}

export function PlantLine({ className = "" }: { className?: string }) {
  // Abstract grayscale production line: sawtooth roofs, stacks, conveyor and gears.
  return (
    <svg aria-hidden="true" viewBox="0 0 560 220" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" className={className}>
      <path d="M10 200 H550" opacity=".5" />
      <path d="M30 200 V120 L70 95 V120 L110 95 V120 L150 95 V120 L190 95 V200" />
      <path d="M215 200 V60 H235 V200 M245 200 V80 H262 V200" />
      <path d="M222 50 q8 -10 0 -20 q-8 -10 0 -20" opacity=".35" />
      <path d="M280 200 V130 H420 V200" />
      {[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={292 + i * 21} y="145" width="12" height="16" rx="2" opacity=".6" />)}
      <path d="M300 182 H520" strokeDasharray="2 6" />
      <circle cx="300" cy="182" r="9" /><circle cx="520" cy="182" r="9" />
      <circle cx="480" cy="110" r="22" /><circle cx="480" cy="110" r="7" />
      {[0, 45, 90, 135].map((a) => <path key={a} d="M480 82 V90 M480 130 V138" transform={`rotate(${a} 480 110)`} />)}
      <path d="M440 200 V140 H520 V200" opacity=".7" />
      {[0, 1, 2].map((i) => <path key={i} d={`M${50 + i * 40} 140 h20 v14 h-20 z`} opacity=".5" />)}
    </svg>
  );
}

export const bento = "grid gap-4 sm:grid-cols-2 lg:grid-cols-4 auto-rows-[minmax(10rem,auto)]";

export function CTA({ title, text }: { title: string; text: string }) {
  return (
    <section className="py-14">
      <div className="container-site">
        <div className="tile relative flex flex-col items-start gap-6 overflow-hidden border-ink-border bg-ink p-8 text-ink-foreground md:flex-row md:items-center md:justify-between md:p-12">
          <Contours className="text-amber" />
          <div className="relative max-w-xl">
            <h2 className="text-2xl font-semibold md:text-3xl">{title}</h2>
            <p className="mt-2 text-ink-muted">{text}</p>
          </div>
          <Link to="/" hash="contact" className="relative inline-flex shrink-0 items-center rounded-lg bg-amber px-5 py-2.5 text-sm font-medium text-amber-foreground hover:opacity-90">
            Start a conversation
          </Link>
        </div>
      </div>
    </section>
  );
}

export const SECTORS = [
  "Automotive and EV components", "Electronics and semiconductors", "Engineering goods",
  "Pharma and medical devices", "Food processing", "Chemicals and specialty materials",
  "Renewable energy equipment", "Global capability centres", "SaaS and IT services",
];

export function pageHead(title: string, description: string, path: string) {
  const t = `${title} | VertiStrat Solutions LLP`;
  return {
    meta: [
      { title: t },
      { name: "description", content: description },
      { property: "og:title", content: t },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: path },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: path }],
  };
}
