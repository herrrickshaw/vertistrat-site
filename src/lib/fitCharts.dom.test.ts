import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MIN_LABEL_PX, chartWidthFor, fitCharts } from "./fitCharts";

let shown = 343;

beforeEach(() => {
  shown = 343;
  vi.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(
    () => ({ width: shown, height: 100, top: 0, left: 0, right: shown, bottom: 100 }) as DOMRect,
  );
});

afterEach(() => {
  vi.restoreAllMocks();
});

function chart(viewBox: string, fontSizes: number[], attrs = ""): string {
  const texts = fontSizes.map((f) => `<text style="font-size:${f}px">t</text>`).join("");
  return `<svg viewBox="${viewBox}" ${attrs}>${texts}</svg>`;
}

function mount(html: string): HTMLElement {
  const root = document.createElement("div");
  root.innerHTML = html;
  document.body.appendChild(root);
  return root;
}

describe("chartWidthFor boundaries", () => {
  it("exports a 10px minimum label size and uses it by default", () => {
    expect(MIN_LABEL_PX).toBe(10);
    expect(chartWidthFor(700, 12, 343, 10)).toBe(chartWidthFor(700, 12, 343));
  });

  it("ignores charts narrower than 300 units but not exactly 300", () => {
    expect(chartWidthFor(299, 12, 150)).toBeNull();
    expect(chartWidthFor(300, 12, 150)).toBe(250);
  });

  it("ignores a shown width under 120px but not exactly 120", () => {
    expect(chartWidthFor(700, 12, 119)).toBeNull();
    expect(chartWidthFor(700, 12, 120)).toBe(583);
  });

  it("ignores zero, negative and NaN inputs", () => {
    expect(chartWidthFor(700, -1, 343)).toBeNull();
    expect(chartWidthFor(Number.NaN, 12, 343)).toBeNull();
    expect(chartWidthFor(700, Number.NaN, 343)).toBeNull();
    expect(chartWidthFor(700, 12, Number.NaN)).toBeNull();
  });

  it("only widens when the needed width exceeds the shown width by more than 1px", () => {
    // need = 700 * 10 / 12 = 583.33
    expect(chartWidthFor(700, 12, 583)).toBeNull();
    expect(chartWidthFor(700, 12, 582)).toBe(583);
  });

  it("treats a chart exactly 1px short of its natural width as readable", () => {
    // need = 700 * 10 / 10 = 700, shown + 1 = 700
    expect(chartWidthFor(700, 10, 699)).toBeNull();
    expect(chartWidthFor(700, 10, 698)).toBe(700);
  });

  it("honours a custom minimum label size", () => {
    expect(chartWidthFor(700, 10, 343, 14)).toBe(700);
    expect(chartWidthFor(700, 10, 343, 5)).toBe(350);
  });
});

describe("fitCharts: charts", () => {
  it("wraps a small-label chart in a focusable scroll region sized for readable labels", () => {
    const root = mount(chart("0 0 700 300", [12, 12, 12]));
    const svg = root.querySelector("svg")!;
    fitCharts(root);

    const wrap = root.querySelector<HTMLElement>(".post-chart-scroll")!;
    expect(wrap).not.toBeNull();
    expect(wrap.contains(svg)).toBe(true);
    expect(wrap.tabIndex).toBe(0);
    expect(wrap.getAttribute("role")).toBe("region");
    expect(wrap.getAttribute("aria-label")).toBe("Chart, scrolls sideways");
    expect(svg.style.getPropertyValue("width")).toBe("583px");
    expect(svg.style.getPropertyPriority("width")).toBe("important");
    expect(svg.style.getPropertyValue("max-width")).toBe("none");
    expect(svg.style.getPropertyPriority("max-width")).toBe("important");
    expect(svg.style.height).toBe("auto");
  });

  it("puts a swipe hint directly before the scroller", () => {
    const root = mount(chart("0 0 700 300", [12]));
    fitCharts(root);
    const wrap = root.querySelector(".post-chart-scroll")!;
    const hint = wrap.previousElementSibling!;
    expect(hint.tagName).toBe("P");
    expect(hint.className).toBe("post-swipe");
    expect(hint.getAttribute("aria-hidden")).toBe("true");
    expect(hint.textContent).toBe("Swipe sideways to read the whole chart →");
  });

  it("uses the median label size: with an even count, the upper middle", () => {
    // sizes sorted [6, 12]: index 1 = 12 -> 583px; if it used 6 the chart is wide enough (700)
    const even = mount(chart("0 0 700 300", [12, 6]));
    fitCharts(even);
    expect(even.querySelector("svg")!.style.getPropertyValue("width")).toBe("583px");
    // sorted [6, 6, 12]: median 6 -> need 700 -> 700px
    const odd = mount(chart("0 0 700 300", [12, 6, 6]));
    fitCharts(odd);
    expect(odd.querySelector("svg")!.style.getPropertyValue("width")).toBe("700px");
  });

  it("ignores zero-size text when taking the median label size", () => {
    // sizes [6, 12] after dropping the 0: median 12 -> 583px; keeping the 0 would pick 6 -> 700px
    const root = mount(chart("0 0 700 300", [0, 6, 12]));
    fitCharts(root);
    expect(root.querySelector("svg")!.style.getPropertyValue("width")).toBe("583px");
  });

  it("parses viewBox values separated by commas as well as spaces", () => {
    const root = mount(chart("0,0,700,300", [12]));
    fitCharts(root);
    expect(root.querySelector(".post-chart-scroll")).not.toBeNull();
  });

  it("leaves charts that are already readable, have no text, or have a bad viewBox", () => {
    shown = 640;
    const readable = mount(chart("0 0 700 300", [12]));
    fitCharts(readable);
    expect(readable.querySelector(".post-chart-scroll")).toBeNull();

    shown = 343;
    const noText = mount('<svg viewBox="0 0 700 300"></svg>');
    fitCharts(noText);
    expect(noText.querySelector(".post-chart-scroll")).toBeNull();

    const zeroSize = mount(chart("0 0 700 300", [0]));
    fitCharts(zeroSize);
    expect(zeroSize.querySelector(".post-chart-scroll")).toBeNull();

    const badBox = mount(chart("nonsense", [12]));
    fitCharts(badBox);
    expect(badBox.querySelector(".post-chart-scroll")).toBeNull();

    const shortBox = mount(chart("0 0", [12]));
    fitCharts(shortBox);
    expect(shortBox.querySelector(".post-chart-scroll")).toBeNull();
  });

  it("ignores svgs without a viewBox", () => {
    const root = mount('<svg><text style="font-size:12px">t</text></svg>');
    fitCharts(root);
    expect(root.querySelector(".post-chart-scroll")).toBeNull();
  });

  it("skips charts from the exec_viz kit (.xv) and charts already in a scroller", () => {
    const xv = mount(`<div class="xv">${chart("0 0 700 300", [12])}</div>`);
    fitCharts(xv);
    expect(xv.querySelector(".post-chart-scroll")).toBeNull();

    const done = mount(`<div class="post-chart-scroll">${chart("0 0 700 300", [12])}</div>`);
    fitCharts(done);
    expect(done.querySelectorAll(".post-chart-scroll")).toHaveLength(1);
    expect(done.querySelector(".post-swipe")).toBeNull();
  });

  it("skips charts that already sit in a sideways-scrolling ancestor inside the root", () => {
    for (const overflow of ["auto", "scroll"]) {
      const root = mount(`<div style="overflow-x:${overflow}">${chart("0 0 700 300", [12])}</div>`);
      fitCharts(root);
      expect(root.querySelector(".post-chart-scroll"), overflow).toBeNull();
    }
  });

  it("does not count the root itself or non-scrolling overflow values", () => {
    const rootScrolls = document.createElement("div");
    rootScrolls.style.overflowX = "auto";
    rootScrolls.innerHTML = chart("0 0 700 300", [12]);
    document.body.appendChild(rootScrolls);
    fitCharts(rootScrolls);
    expect(rootScrolls.querySelector(".post-chart-scroll")).not.toBeNull();

    const hidden = mount(`<div style="overflow-x:hidden">${chart("0 0 700 300", [12])}</div>`);
    fitCharts(hidden);
    expect(hidden.querySelector(".post-chart-scroll")).not.toBeNull();
  });

  it("is idempotent", () => {
    const root = mount(chart("0 0 700 300", [12]));
    fitCharts(root);
    fitCharts(root);
    expect(root.querySelectorAll(".post-chart-scroll")).toHaveLength(1);
    expect(root.querySelectorAll(".post-swipe")).toHaveLength(1);
  });

  it("handles several charts independently", () => {
    const root = mount(chart("0 0 700 300", [12]) + chart("0 0 700 300", [6]));
    fitCharts(root);
    const widths = Array.from(root.querySelectorAll("svg"), (s) =>
      s.style.getPropertyValue("width"),
    );
    expect(widths).toEqual(["583px", "700px"]);
  });
});

describe("fitCharts: tables", () => {
  function table(scrollWidth: number, clientWidth: number, inner = "<table></table>") {
    const root = mount(`<div class="post-scroll">${inner}</div>`);
    const box = root.querySelector<HTMLElement>(".post-scroll")!;
    Object.defineProperty(box, "scrollWidth", { configurable: true, value: scrollWidth });
    Object.defineProperty(box, "clientWidth", { configurable: true, value: clientWidth });
    return { root, box };
  }

  it("marks a table that overflows sideways and adds a hint before it", () => {
    const { root, box } = table(600, 300);
    fitCharts(root);
    expect(box.classList.contains("post-scroll-wide")).toBe(true);
    expect(box.dataset["hinted"]).toBe("1");
    const hint = box.previousElementSibling!;
    expect(hint.className).toBe("post-swipe");
    expect(hint.textContent).toBe("Swipe the table sideways for more columns →");
  });

  it("needs more than 4px of overflow", () => {
    const exactly = table(304, 300);
    fitCharts(exactly.root);
    expect(exactly.box.classList.contains("post-scroll-wide")).toBe(false);
    const over = table(305, 300);
    fitCharts(over.root);
    expect(over.box.classList.contains("post-scroll-wide")).toBe(true);
  });

  it("ignores scroll boxes without a table", () => {
    const { root, box } = table(600, 300, "<pre>code</pre>");
    fitCharts(root);
    expect(box.classList.contains("post-scroll-wide")).toBe(false);
    expect(root.querySelector(".post-swipe")).toBeNull();
  });

  it("only hints once", () => {
    const { root } = table(600, 300);
    fitCharts(root);
    fitCharts(root);
    expect(root.querySelectorAll(".post-swipe")).toHaveLength(1);
  });
});
