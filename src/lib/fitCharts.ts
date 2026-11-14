// Phone readability for blog charts shown on /insights/$slug.
// Most older blog charts are inline SVGs drawn about 700 units wide; shrunk to a phone they render labels at
// about 6px. This gives such a chart the width at which its typical label renders at MIN_LABEL_PX, inside a
// sideways scroller with a one-line hint. It mirrors the blog theme module gs-mobile-v1 (blogger_writeups_code,
// templates/gs-mobile-v1.js). Charts built with the blog's exec_viz kit (.xv) are already phone-sized.

export const MIN_LABEL_PX = 10;

/** Width (px) at which a chart's labels reach minPx, or null if it is readable as shown. */
export function chartWidthFor(
  viewBoxWidth: number,
  labelUnits: number,
  shownPx: number,
  minPx = MIN_LABEL_PX,
): number | null {
  if (!(viewBoxWidth >= 300) || !(labelUnits > 0) || !(shownPx >= 120)) return null;
  const need = Math.min(viewBoxWidth, (viewBoxWidth * minPx) / labelUnits);
  return need > shownPx + 1 ? Math.round(need) : null;
}

function typicalLabel(svg: SVGSVGElement): number {
  const sizes = Array.from(svg.querySelectorAll("text"), (t) =>
    parseFloat(getComputedStyle(t).fontSize),
  ).filter((f) => f > 0);
  if (!sizes.length) return 0;
  sizes.sort((a, b) => a - b);
  return sizes[sizes.length >> 1] ?? 0;
}

function scrollsAlready(el: Element, root: Element): boolean {
  for (let a = el.parentElement; a && a !== root; a = a.parentElement) {
    const o = getComputedStyle(a).overflowX;
    if (o === "auto" || o === "scroll") return true;
  }
  return false;
}

function hint(text: string, before: Element) {
  const p = document.createElement("p");
  p.className = "post-swipe";
  p.setAttribute("aria-hidden", "true");
  p.textContent = text;
  before.before(p);
}

/** Wrap small-label charts in scrollers and mark tables that scroll sideways. Safe to call more than once. */
export function fitCharts(root: Element) {
  root.querySelectorAll<SVGSVGElement>("svg[viewBox]").forEach((svg) => {
    if (svg.closest(".post-chart-scroll, .xv") || scrollsAlready(svg, root)) return;
    const viewBoxWidth = parseFloat(
      (svg.getAttribute("viewBox") ?? "").trim().split(/[\s,]+/)[2] ?? "",
    );
    const width = chartWidthFor(viewBoxWidth, typicalLabel(svg), svg.getBoundingClientRect().width);
    if (!width) return;
    const wrap = document.createElement("div");
    wrap.className = "post-chart-scroll";
    wrap.tabIndex = 0;
    wrap.setAttribute("role", "region");
    wrap.setAttribute("aria-label", "Chart, scrolls sideways");
    svg.before(wrap);
    wrap.appendChild(svg);
    svg.style.setProperty("width", `${width}px`, "important");
    svg.style.setProperty("max-width", "none", "important");
    svg.style.height = "auto";
    hint("Swipe sideways to read the whole chart →", wrap);
  });
  root.querySelectorAll<HTMLElement>(".post-scroll").forEach((box) => {
    if (
      box.dataset["hinted"] ||
      box.scrollWidth <= box.clientWidth + 4 ||
      !box.querySelector("table")
    )
      return;
    box.dataset["hinted"] = "1";
    box.classList.add("post-scroll-wide");
    hint("Swipe the table sideways for more columns →", box);
  });
}
