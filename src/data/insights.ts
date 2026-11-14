import allArticles from "./allArticles.json";
import themeOverridesRaw from "./themeOverrides.json";

export type InsightItem = { title: string; url: string; postId: string; published: string; excerpt: string; theme?: string | undefined };
export type InsightTheme = { theme: string; slug: string; items: InsightItem[] };

export const INSIGHT_THEMES: InsightTheme[] = [
  {
    theme: "Industrial policy & incentives",
    slug: "industrial-policy",
    items: [
      { title: "Factory investment in India: 63.3% in Gujarat, Odisha and Maharashtra, 2021-2025", url: "https://blog.vertistratsolution.com/2026/08/where-indias-factories-actually-get.html", postId: "2906394065511429472", published: "2026-08-02", excerpt: "DPIIT's Industrial Entrepreneurs Memoranda, Part A (intent filed) vs Part B (implemented), broken down by state and by sector." },
      { title: "India's chip plants: about Rs 5,619 crore of Rs 76,000 crore spent by March 2026", url: "https://blog.vertistratsolution.com/2026/10/india-has-approved-12-chip-plants-and.html", postId: "202841857476098239", published: "2026-10-27", excerpt: "Twelve chip plants approved, about 7% of the money paid out, and five producing, all assembly or packaging. What Semicon 2.0 changes." },
      { title: "BHAVYA parks: Rs 33,660 crore, while existing parks have 1.25 lakh empty plots", url: "https://blog.vertistratsolution.com/2026/10/india-will-spend-rs-33660-crore-on.html", postId: "1008146607143508554", published: "2026-10-27", excerpt: "BHAVYA will fund 100 plug-and-play industrial parks, but existing parks already hold 1.25 lakh empty plots. The test is whether new ones fill faster." },
      { title: "India's Rs 3,030 crore chemical parks: bulk-drug park model released 6% in 6 years", url: "https://blog.vertistratsolution.com/2026/10/indias-rs-3030-crore-chemical-parks.html", postId: "3891676620961960953", published: "2026-10-27", excerpt: "Three state-run chemical parks get shared effluent and steam plants, copying a bulk-drug parks scheme that released 6% of its money." },
    ],
  },
  {
    theme: "Energy, fuels & biofuels",
    slug: "energy",
    items: [
      { title: "Biofuel blends and mileage: ethanol carries 66% of petrol's energy per litre", url: "https://blog.vertistratsolution.com/2026/08/blending-on-budget-energy-density-and.html", postId: "753290623294277289", published: "2026-08-19", excerpt: "Ethanol in petrol and isobutanol in diesel both carry less energy than the fuel they replace. What that does to cost per kilometre across four blending mandates." },
      { title: "India's ethanol overcapacity: about 2,000 crore litres built, and uses for the surplus", url: "https://blog.vertistratsolution.com/2026/10/indias-ethanol-surplus-buys-about-five.html", postId: "3153858344526767482", published: "2026-10-03", excerpt: "1,776 crore litres offered against a need of about 1,050 in 2025-26 — yet the surplus covers only about five more points of petrol blending." },
      { title: "Fuel theft in India: a history from kerosene in diesel to ethanol in petrol", url: "https://blog.vertistratsolution.com/2026/11/from-kerosene-in-diesel-to-ethanol-in.html", postId: "6056302382445516180", published: "2026-11-07", excerpt: "From kerosene in diesel to pipeline taps and fake biodiesel, and now a state claiming its petrol holds up to 31% ethanol." },
      { title: "Gas in India's energy mix: share down from 7.5% to 7.0%, against a 15% target", url: "https://blog.vertistratsolution.com/2026/10/india-wants-15-of-its-energy-from-gas.html", postId: "2959990450759480653", published: "2026-10-28", excerpt: "Gas has slipped from 7.5% to 7.0% of primary energy. Reaching 15% by 2030 would take almost three times today’s gas, nearly all imported LNG." },
    ],
  },
  {
    theme: "Trade & tariffs",
    slug: "trade",
    items: [
      { title: "India's mineral oil trade, HSN Chapter 27: trade balance and pricing dashboard", url: "https://blog.vertistratsolution.com/2026/08/india-mineral-oil-hsn-ch27-trade.html", postId: "6935574229087271959", published: "2026-07-30", excerpt: "The trade and duty picture for base oil and other Chapter 27 mineral-oil lines." },
      { title: "US tariffs on Indian goods: from 50% in August 2025 to 10% since 24 July 2026", url: "https://blog.vertistratsolution.com/2026/09/the-50-tariff-and-234-one-untangling.html", postId: "1955301576624189231", published: "2026-09-12", excerpt: "The 50% US tariff on Indian goods, the three legal mechanisms that followed, and the Supreme Court ruling that reshaped what exporters face." },
      { title: "India-MERCOSUR trade: about $4.9 billion deficit in 2025-26, 81% with Argentina", url: "https://blog.vertistratsolution.com/2026/10/india-and-mercosur-are-expanding-450.html", postId: "4764289379784296131", published: "2026-10-09", excerpt: "Talks to widen a 450-line pact with four MERCOSUR members, where India’s deficit has nearly quadrupled to about $4.9 billion." },
      { title: "New Zealand's tariffs on India: zero from 20 October 2026, most lines already free", url: "https://blog.vertistratsolution.com/2026/10/new-zealand-opens-every-tariff-line-to.html", postId: "7454858950504341431", published: "2026-10-09", excerpt: "All Indian goods enter New Zealand duty-free from 20 October, but most lines were already open. What India gives in return." },
    ],
  },
  {
    theme: "Agriculture & food processing",
    slug: "agri-food",
    items: [
      { title: "India's milk: 247.87 million tonnes in 2024-25, with cheese a value-added opportunity", url: "https://blog.vertistratsolution.com/2026/08/the-milk-india-doesnt-drink-cheese-and.html", postId: "8789563962657892583", published: "2026-08-19", excerpt: "India made 247.87 million tonnes of milk in 2024-25 and sells about two-thirds of it as liquid milk. The case for value-added dairy." },
      { title: "Guar gum: India's $3.5 billion export peak, the crash, and its fit for poor soil", url: "https://blog.vertistratsolution.com/2026/08/guar-gum-indias-35-billion-export-peak.html", postId: "5630156769104678345", published: "2026-08-16", excerpt: "India supplies roughly 80% of the world's guar gum. The boom, the crash, and why the crop still suits arid, low-fertility land." },
      { title: "India's rabi and summer crops: 53% of foodgrains, up from 36% in 1966-67", url: "https://blog.vertistratsolution.com/2026/10/indias-winter-harvest-now-outgrows-its.html", postId: "8997016915516503409", published: "2026-10-25", excerpt: "Rabi and summer crops now give 53% of India’s foodgrains, up from 36% in 1966-67. Area, yield and mandi timing, crop by crop." },
      { title: "Crop residue machines in India: 3 lakh subsidised, about 4,500 collect straw", url: "https://blog.vertistratsolution.com/2026/10/india-has-funded-3-lakh-machines-to.html", postId: "206710431453134033", published: "2026-10-28", excerpt: "Three lakh machines funded, about 4,500 collecting straw for a buyer, and only in four northern states. Power plants and pellet makers need far more." },
    ],
  },
  {
    theme: "Capital, deals & climate",
    slug: "capital-climate",
    items: [
      { title: "PET recycling in India: over 60% lower emissions, new rules require traceability", url: "https://blog.vertistratsolution.com/2026/08/pet-recycling-already-cuts-emissions-60.html", postId: "7452695219826556995", published: "2026-08-16", excerpt: "Recycled PET uses 70–79% less energy than virgin plastic. The new rules are about traceability, not volume." },
      { title: "CBAM on Indian steel in 2026: €93 a tonne with verified data, €270 without", url: "https://blog.vertistratsolution.com/2026/10/to-comply-or-not-to-comply-cbam-costs.html", postId: "3999899821885202327", published: "2026-10-24", excerpt: "Verified emissions data cuts the 2026 CBAM charge on Indian hot-rolled coil from about €270 a tonne to €93." },
      { title: "IDBI Bank sale to Fairfax at ₹81 a share: rescuers profit, but below a 7% return", url: "https://blog.vertistratsolution.com/2026/11/idbi-banks-rescuers-put-in-54000-crore.html", postId: "6674925609543228976", published: "2026-11-08", excerpt: "Fairfax pays ₹52,878 crore for 60.72% of IDBI Bank. What the government and LIC get back on their rescue money." },
      { title: "India's net FDI: $7.7 billion stayed of a record $94.5 billion last year", url: "https://blog.vertistratsolution.com/2026/10/india-got-record-945-billion-of-fdi.html", postId: "5872586407197754812", published: "2026-10-27", excerpt: "Gross FDI hit a record $94.5 billion, but after exits and investment abroad only $7.7 billion stayed." },
    ],
  },
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export function formatInsightDate(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d} ${MONTHS[Number(m) - 1]} ${y}`;
}
export const isLiveUrl = (u: string) => /^https?:\/\//.test(u);

export const articleSlug = (url: string): string => (url.split("/").pop() ?? "").replace(/\.html$/, "");

type RawLibrary = { themes: [string, string][]; articles: [string, string, string, string, number][] };
const RAW = allArticles as unknown as RawLibrary;
/** Re-classified themes by postId (from Blogger labels), overriding the JSON theme index. */
export const themeOverrides = themeOverridesRaw as Record<string, string>;
/** Library themes: slug and display name, in JSON order. */
export const LIBRARY_THEMES = RAW.themes.map(([slug, name]) => ({ slug, name }));
/** Every blog article (newest first), from src/data/allArticles.json. */
export const LIBRARY: InsightItem[] = RAW.articles.map(([postId, path, title, published, themeIndex]) => ({
  postId, title, published, excerpt: "", url: `https://blog.vertistratsolution.com/${path}.html`, theme: themeOverrides[postId] ?? RAW.themes[themeIndex]?.[0],
}));

const BY_SLUG = new Map<string, InsightItem>();
for (const a of LIBRARY) BY_SLUG.set(articleSlug(a.url), a);
for (const a of INSIGHT_THEMES.flatMap((t) => t.items)) BY_SLUG.set(articleSlug(a.url), a); // curated wins
export const findArticle = (slug: string): InsightItem | undefined => BY_SLUG.get(slug);
export const allFindableArticles = () => [...BY_SLUG.values()];
