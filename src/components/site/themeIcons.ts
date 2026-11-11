import { Fuel, Landmark, Leaf, Newspaper, Ship, Sprout, TrendingUp, type LucideIcon } from "lucide-react";

// Icons per Insights theme (by slug) and per blog tag (for most-read cards).
export const THEME_ICON: Record<string, LucideIcon> = {
  "industrial-policy": Landmark,
  energy: Fuel,
  trade: Ship,
  "agri-food": Sprout,
};
export const themeIcon = (slug: string): LucideIcon => THEME_ICON[slug] ?? TrendingUp;

export function tagIcon(tag = ""): LucideIcon {
  if (/ethanol|biofuel/i.test(tag)) return Leaf;
  if (/energy|fuel/i.test(tag)) return Fuel;
  if (/trade|tariff/i.test(tag)) return Ship;
  if (/food|agri/i.test(tag)) return Sprout;
  if (/finance|m&a|capital/i.test(tag)) return TrendingUp;
  if (/policy/i.test(tag)) return Landmark;
  return Newspaper;
}
