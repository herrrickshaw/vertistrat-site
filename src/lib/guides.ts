import { INSIGHT_THEMES, LIBRARY, isLiveUrl, type InsightItem } from "@/data/insights";

// All curated articles, flattened. Links come only from src/data/insights.ts.
export const ALL_ARTICLES: InsightItem[] = INSIGHT_THEMES.flatMap((t) => t.items).filter((a) => isLiveUrl(a.url));

// Match on the title and on the address slug's words. Titles change (house-style retitles);
// a post's slug never does and still carries the words of its original title.
const matchText = (a: InsightItem) =>
  `${a.title} ${(a.url.split("/").pop() ?? "").replace(/\.html$/, "").replace(/-/g, " ")}`;

export function matchArticles(pattern: RegExp | null): InsightItem[] {
  if (!pattern) return [];
  const seen = new Set<string>();
  const pick = (list: InsightItem[]) => list.filter((a) => pattern.test(matchText(a)) && !seen.has(a.url) && seen.add(a.url));
  const curated = pick(ALL_ARTICLES);
  // Featured matches first; top up from the full library (newest first) to at least 3.
  if (curated.length >= 3) return curated;
  return [...curated, ...pick(LIBRARY).slice(0, 3 - curated.length)];
}

export type GuideTopic = { key: string; label: string; pattern: RegExp };

// "Doing business in India" topics, matched to existing article titles by keyword.
export const GUIDE_TOPICS: GuideTopic[] = [
  { key: "company", label: "Company setup", pattern: /M&A|Green Debt/i },
  { key: "incentives", label: "Incentives & schemes", pattern: /\b(PLI|SGST|MSP)\b/ },
  { key: "approvals", label: "Approvals", pattern: /\b(Approvals?|Clearances?|Licen[cs]es?|Permits?|Rules|Regulat\w+|Zero-Liquid)\b/i },
  { key: "land", label: "Land & site", pattern: /Factories Actually|IEM Conversion/i },
  { key: "trade", label: "Trade & customs", pattern: /\bHSN\b|Forex|Five-Year|\bGuar\b/i },
  { key: "energy", label: "Energy & utilities", pattern: /Fuel|Ethanol|Energy|Biorefinery/i },
];

export const guideArticles = (key: string) => matchArticles(GUIDE_TOPICS.find((g) => g.key === key)?.pattern ?? null);

export const ENERGY_PRACTICE_PATTERN = /Ethanol|Biofuel|Biorefinery|Fuel|Green Debt|Zero-Liquid/i;
export const energyPracticeArticles = () => matchArticles(ENERGY_PRACTICE_PATTERN);

// Sector descriptions (<=12 words) and article keywords; null = no related articles.
export const SECTOR_INFO: { blurb: string; pattern: RegExp | null }[] = [
  { blurb: "Component plants, EV supply chains and fuel transition planning.", pattern: /Fuel|E30|Blend/i },
  { blurb: "Electronics assembly and chip supply chains under PLI-style schemes.", pattern: /\bPLI\b/ },
  { blurb: "Machinery and fabricated goods: sites, capacity and exports.", pattern: /Factories Actually|Export Destinations/i },
  { blurb: "Regulated plants needing approvals, quality systems and incentives.", pattern: null },
  { blurb: "Grain, dairy and value-added processing from farm to plant.", pattern: /Grain|Milk|FCI|\bRice\b|\bGuar\b/i },
  { blurb: "Specialty materials, recycling and discharge compliance.", pattern: /\bPET\b|Zero-Liquid|\bHSN\b/ },
  { blurb: "Biofuels, green finance and clean-energy equipment.", pattern: /Ethanol|Biofuel|Green/i },
  { blurb: "Capability centres: entity, location, hiring and incentives.", pattern: null },
  { blurb: "Delivery centres and selling technology into manufacturing.", pattern: null },
];
