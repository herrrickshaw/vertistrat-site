import { Fuel, Landmark, Leaf, Newspaper, Ship, Sprout, TrendingUp } from "lucide-react";
import { describe, expect, it } from "vitest";
import { THEME_ICON, tagIcon, themeIcon } from "./themeIcons";

describe("themeIcon", () => {
  it("maps each insights theme slug to its icon", () => {
    expect(themeIcon("industrial-policy")).toBe(Landmark);
    expect(themeIcon("energy")).toBe(Fuel);
    expect(themeIcon("trade")).toBe(Ship);
    expect(themeIcon("agri-food")).toBe(Sprout);
    expect(Object.keys(THEME_ICON)).toHaveLength(4);
  });

  it("falls back to the trending icon for unknown slugs", () => {
    expect(themeIcon("capital-climate")).toBe(TrendingUp);
    expect(themeIcon("")).toBe(TrendingUp);
  });
});

describe("tagIcon", () => {
  it.each([
    ["Ethanol & Biofuels", Leaf],
    ["biofuel", Leaf],
    ["Energy & Fuels", Fuel],
    ["FUEL", Fuel],
    ["Trade & Tariffs", Ship],
    ["tariff watch", Ship],
    ["Food Processing", Sprout],
    ["Agriculture", Sprout],
    ["Corporate Finance & M&A", TrendingUp],
    ["Capital markets", TrendingUp],
    ["M&A", TrendingUp],
    ["Industrial Policy", Landmark],
    ["Something else", Newspaper],
  ])("maps %s", (tag, icon) => {
    expect(tagIcon(tag)).toBe(icon);
  });

  it("defaults to the newspaper icon with no tag", () => {
    expect(tagIcon()).toBe(Newspaper);
    expect(tagIcon("")).toBe(Newspaper);
  });

  it("checks biofuel before energy, and trade before policy, when a tag matches several", () => {
    expect(tagIcon("Biofuel energy")).toBe(Leaf);
    expect(tagIcon("India Trade & Policy")).toBe(Ship);
  });
});
