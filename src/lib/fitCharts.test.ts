import { describe, expect, it } from "vitest";
import { chartWidthFor, fitCharts } from "./fitCharts";

describe("chartWidthFor", () => {
  it("widens a 700-unit chart with 12-unit labels shown at 343px so labels reach 10px", () => {
    expect(chartWidthFor(700, 12, 343)).toBe(583);
  });
  it("never widens a chart past its natural width", () => {
    expect(chartWidthFor(700, 6, 343)).toBe(700);
  });
  it("leaves charts that are already readable, small icons and charts with no text alone", () => {
    expect(chartWidthFor(700, 12, 640)).toBeNull();
    expect(chartWidthFor(360, 13, 343)).toBeNull();
    expect(chartWidthFor(200, 8, 150)).toBeNull();
    expect(chartWidthFor(700, 0, 343)).toBeNull();
    expect(chartWidthFor(700, 12, 80)).toBeNull();
  });
});

describe("fitCharts", () => {
  it("does nothing without layout (no sizes to measure) and is safe to call twice", () => {
    const root = document.createElement("div");
    root.innerHTML =
      '<svg viewBox="0 0 700 300"><text font-size="12">x</text></svg><div class="post-scroll"><table></table></div>';
    fitCharts(root);
    fitCharts(root);
    expect(root.querySelector(".post-chart-scroll")).toBeNull();
    expect(root.querySelectorAll(".post-swipe")).toHaveLength(0);
  });
});
