import DOMPurify from "dompurify";

function parsePost(html: string) {
  return new DOMParser().parseFromString(html, "text/html");
}

export function hasInteractiveCharts(html: string): boolean {
  return Array.from(parsePost(html).querySelectorAll("script")).some((script) => {
    if (script.hasAttribute("src") || !script.textContent?.trim()) return false;
    const text = script.textContent;
    const translate = /googleTranslateElementInit|TranslateElement|google_translate_element/.test(text);
    const accordion = /accordion/i.test(text) && !/Plotly|Chart\s*\(|echarts|Highcharts|vega|d3\./i.test(text);
    return !translate && !accordion;
  });
}

export function sanitizePost(html: string): string {
  const document = parsePost(html);
  document.querySelectorAll("#google_translate_element").forEach((widget) => {
    const wrapper = widget.parentElement;
    const wrapsArticle = wrapper?.querySelector("p, table, h1, h2, h3, figure, article");
    if (wrapper && wrapper.tagName !== "BODY" && wrapper.tagName !== "HTML" && !wrapsArticle) wrapper.remove();
    else widget.remove();
  });
  // Full documents can carry styles in the head; keep those with the body.
  const styles = Array.from(document.head.querySelectorAll("style")).map((style) => style.outerHTML).join("");
  const clean = DOMPurify.sanitize(`${styles}${document.body.innerHTML}`, {
    ADD_TAGS: ["style"],
    ADD_ATTR: ["style"],
    FORBID_TAGS: ["script", "iframe", "object", "embed", "form", "input", "button", "base", "link", "meta"],
    WHOLE_DOCUMENT: false,
    FORCE_BODY: true,
  });
  const result = parsePost(clean);
  result.querySelectorAll("*").forEach((element) => {
    for (const attribute of Array.from(element.attributes)) {
      if (/^on/i.test(attribute.name) || /^\s*javascript:/i.test(attribute.value.replace(/[\u0000-\u0020]/g, ""))) element.removeAttribute(attribute.name);
    }
  });
  result.querySelectorAll("a").forEach((link) => {
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
  });
  return Array.from(result.head.querySelectorAll("style")).map((style) => style.outerHTML).join("") + result.body.innerHTML;
}